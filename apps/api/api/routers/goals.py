import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.models import Goal, User, AuditLog
from api.schemas import GoalCreate, GoalUpdate, GoalResponse, GoalListResponse
from api.dependencies import get_current_user, require_role
from api.services import trigger_pusher_event

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("/my", response_model=GoalListResponse)
def get_my_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # ROW-LEVEL SECURITY ENFORCEMENT
    # Employees only see their own goals
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    
    total_weightage = sum(g.weightage for g in goals)
    remaining_weightage = 100 - total_weightage
    
    # Determine overall status of sheet (default to DRAFT if any goals are draft)
    status = "APPROVED"
    if any(g.status == "DRAFT" for g in goals):
        status = "DRAFT"
    elif any(g.status == "SUBMITTED" for g in goals):
        status = "SUBMITTED"
    elif any(g.status == "LOCKED" for g in goals):
        status = "LOCKED"

    return {
        "goals": goals,
        "total_weightage": total_weightage,
        "remaining_weightage": remaining_weightage,
        "status": status
    }

@router.post("/create", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(goal_data: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Row-Level Security / Authorization Enforced
    if current_user.role != "EMPLOYEE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employees can create goals."
        )

    # 1. Enforce max 8 goals rule
    existing_goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    if len(existing_goals) >= 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rule Violation: Maximum of 8 goals allowed per employee."
        )

    # 2. Enforce min 10% weightage rule
    if goal_data.weightage < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rule Violation: Minimum weightage per goal is 10%."
        )

    # 3. Enforce total weightage <= 100% rule
    current_total = sum(g.weightage for g in existing_goals)
    if current_total + goal_data.weightage > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Rule Violation: Adding this goal would exceed 100% weightage budget. Total weightage available is {100 - current_total}%."
        )

    new_goal = Goal(
        id=f"g-{uuid.uuid4().hex[:8]}",
        user_id=current_user.id,
        thrust_area_id=goal_data.thrust_area_id,
        title=goal_data.title,
        uom=goal_data.uom,
        target=goal_data.target,
        weightage=goal_data.weightage,
        status="DRAFT",
        is_cascaded=False
    )
    
    db.add(new_goal)
    
    # Audit log entry
    audit = AuditLog(
        user_id=current_user.id,
        action="CREATE",
        field_changed="Goal",
        old_value="None",
        new_value=goal_data.title
    )
    db.add(audit)
    
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.put("/{id}", response_model=GoalResponse)
def edit_goal(id: str, goal_data: GoalUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Row-Level Security: Only allowed to edit goals belonging to the logged-in employee
    goal = db.query(Goal).filter(Goal.id == id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found or unauthorized access."
        )

    # Enforce: only allow editing if goal is in DRAFT state
    if goal.status != "DRAFT":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Goal is locked and cannot be edited. Edit is only permitted in DRAFT status."
        )

    if goal_data.weightage is not None:
        # Check overall weight limit rule
        if goal_data.weightage < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rule Violation: Minimum weightage per goal is 10%."
            )
        other_total = sum(g.weightage for g in db.query(Goal).filter(Goal.user_id == current_user.id, Goal.id != id).all())
        if other_total + goal_data.weightage > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Rule Violation: Weightage sum cannot exceed 100%. Max available weightage is {100 - other_total}%."
            )
        
        audit = AuditLog(
            user_id=current_user.id,
            action="EDIT",
            field_changed="weightage",
            old_value=str(goal.weightage),
            new_value=str(goal_data.weightage)
        )
        db.add(audit)
        goal.weightage = goal_data.weightage

    if goal_data.title is not None:
        audit = AuditLog(
            user_id=current_user.id,
            action="EDIT",
            field_changed="title",
            old_value=goal.title,
            new_value=goal_data.title
        )
        db.add(audit)
        goal.title = goal_data.title

    if goal_data.target is not None:
        audit = AuditLog(
            user_id=current_user.id,
            action="EDIT",
            field_changed="target",
            old_value=str(goal.target),
            new_value=str(goal_data.target)
        )
        db.add(audit)
        goal.target = goal_data.target

    db.commit()
    db.refresh(goal)
    return goal

@router.post("/submit")
def submit_goal_sheet(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Row-Level Security check
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    if not goals:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit an empty goal sheet."
        )

    # Validate exactly 100% total weightage before allowing submission
    total_weightage = sum(g.weightage for g in goals)
    if total_weightage != 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Rule Violation: Goal sheet must aggregate to exactly 100% weightage before submitting. Current total: {total_weightage}%."
        )

    # Set status of all draft/rework goals to SUBMITTED
    for goal in goals:
        if goal.status == "DRAFT":
            goal.status = "SUBMITTED"
            
    # Audit log submission
    audit = AuditLog(
        user_id=current_user.id,
        action="SUBMIT",
        field_changed="Status",
        old_value="DRAFT",
        new_value="SUBMITTED"
    )
    db.add(audit)
    db.commit()

    # Trigger Pusher WebSocket notification for real-time manager/admin alerts
    trigger_pusher_event(
        event_type="SUBMIT",
        employee_name=current_user.name,
        department=current_user.department.name if current_user.department else "Sales"
    )

    return {"message": "Goal sheet submitted successfully! Waiting for manager approval."}
