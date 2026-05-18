from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from api.core.database import get_db
from api.models import Goal, User, AuditLog
from api.schemas import TeamMemberResponse, GoalSheetResponse, ReworkRequest, ManagerGoalEdit, GoalResponse
from api.dependencies import get_current_user, require_role
from api.services import trigger_pusher_event, send_teams_notification

router = APIRouter(prefix="/manager", tags=["manager"])

@router.get("/team", response_model=List[TeamMemberResponse])
def get_team_members(current_user: User = Depends(require_role(["MANAGER", "ADMIN"])), db: Session = Depends(get_db)):
    # Row-Level Security: Manager only gets employees whose manager_id is their user_id
    team_members = db.query(User).filter(User.manager_id == current_user.id).all()
    
    response = []
    for member in team_members:
        goals = db.query(Goal).filter(Goal.user_id == member.id).all()
        goals_count = len(goals)
        total_weightage = sum(g.weightage for g in goals)
        
        # Calculate status
        status = "DRAFT"
        if goals_count > 0:
            if any(g.status == "DRAFT" for g in goals):
                status = "DRAFT"
            elif any(g.status == "SUBMITTED" for g in goals):
                status = "SUBMITTED"
            elif any(g.status == "LOCKED" for g in goals):
                status = "LOCKED"
                
        response.append({
            "id": member.id,
            "name": member.name,
            "department": member.department.name if member.department else "Sales",
            "goals_count": goals_count,
            "weightage": total_weightage,
            "status": status
        })
        
    return response

@router.get("/goals/{employee_id}", response_model=GoalSheetResponse)
def get_employee_goals(employee_id: str, current_user: User = Depends(require_role(["MANAGER", "ADMIN"])), db: Session = Depends(get_db)):
    # Row-Level Security: Manager can only inspect goals of their direct reports
    employee = db.query(User).filter(User.id == employee_id, User.manager_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. This employee is not assigned to your supervision."
        )
        
    goals = db.query(Goal).filter(Goal.user_id == employee_id).all()
    total_weight = sum(g.weightage for g in goals)
    
    # overall status
    sheet_status = "DRAFT"
    if goals:
        if any(g.status == "DRAFT" for g in goals):
            sheet_status = "DRAFT"
        elif any(g.status == "SUBMITTED" for g in goals):
            sheet_status = "SUBMITTED"
        elif any(g.status == "LOCKED" for g in goals):
            sheet_status = "LOCKED"
            
    return {
        "employee_name": employee.name,
        "goals": goals,
        "total_weightage": total_weight,
        "status": sheet_status
    }

@router.put("/goals/{goal_id}/edit", response_model=GoalResponse)
def manager_inline_edit_goal(goal_id: str, edit_data: ManagerGoalEdit, current_user: User = Depends(require_role(["MANAGER", "ADMIN"])), db: Session = Depends(get_db)):
    # Fetch goal and verify manager permission (RLS)
    goal = db.query(Goal).join(User).filter(Goal.id == goal_id, User.manager_id == current_user.id).first()
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal sheet not found or belongs to unauthorized reporting channel."
        )
        
    if goal.status == "LOCKED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This goal is locked following manager approval and cannot be modified."
        )
        
    if edit_data.weightage is not None:
        if edit_data.weightage < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rule Violation: Minimum goal weightage is 10%."
            )
        # Verify total sum rule
        other_sum = sum(g.weightage for g in db.query(Goal).filter(Goal.user_id == goal.user_id, Goal.id != goal_id).all())
        if other_sum + edit_data.weightage > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Rule Violation: Total sheet weightage cannot exceed 100%. Available weightage budget is {100 - other_sum}%."
            )
            
        audit = AuditLog(
            user_id=current_user.id,
            action="EDIT",
            field_changed="weightage",
            old_value=str(goal.weightage),
            new_value=str(edit_data.weightage)
        )
        db.add(audit)
        goal.weightage = edit_data.weightage
        
    if edit_data.target is not None:
        audit = AuditLog(
            user_id=current_user.id,
            action="EDIT",
            field_changed="target",
            old_value=str(goal.target),
            new_value=str(edit_data.target)
        )
        db.add(audit)
        goal.target = edit_data.target
        
    db.commit()
    db.refresh(goal)
    return goal

@router.post("/goals/{employee_id}/approve")
def approve_and_lock_goals(employee_id: str, current_user: User = Depends(require_role(["MANAGER", "ADMIN"])), db: Session = Depends(get_db)):
    employee = db.query(User).filter(User.id == employee_id, User.manager_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Reporting channel verification failed."
        )
        
    goals = db.query(Goal).filter(Goal.user_id == employee_id).all()
    if not goals:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot approve an empty goal sheet."
        )
        
    total_weightage = sum(g.weightage for g in goals)
    if total_weightage != 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Rule Violation: Sheet total must aggregate to exactly 100%. Total weightage is {total_weightage}%."
        )
        
    # Lock all goals
    for goal in goals:
        goal.status = "LOCKED"
        
    # Create audit record
    audit = AuditLog(
        user_id=current_user.id,
        action="APPROVE",
        field_changed="Status",
        old_value="SUBMITTED",
        new_value="LOCKED"
    )
    db.add(audit)
    db.commit()
    
    # Real-time integrations
    # 1. Trigger Pusher WebSocket live telemetry updates
    trigger_pusher_event(
        event_type="APPROVE",
        employee_name=employee.name,
        department=employee.department.name if employee.department else "Sales"
    )
    
    # 2. Trigger Mock Teams Webhook
    msg = f"🔔 **Goal Approved & Locked!**\n\nManager **{current_user.name}** has approved the goal sheet for employee **{employee.name}** ({employee.department.name if employee.department else 'Sales'}). All goals are now locked for execution."
    send_teams_notification(msg)
    
    return {"message": "Goal sheet approved and successfully locked! Teams webhook triggered."}

@router.post("/goals/{employee_id}/return")
def return_for_rework(employee_id: str, request: ReworkRequest, current_user: User = Depends(require_role(["MANAGER", "ADMIN"])), db: Session = Depends(get_db)):
    employee = db.query(User).filter(User.id == employee_id, User.manager_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Reporting channel verification failed."
        )
        
    goals = db.query(Goal).filter(Goal.user_id == employee_id).all()
    for goal in goals:
        if goal.status != "LOCKED":
            goal.status = "DRAFT"
            
    audit = AuditLog(
        user_id=current_user.id,
        action="RETURN",
        field_changed="Status",
        old_value="SUBMITTED",
        new_value=f"DRAFT (Rework Comment: {request.comment})"
    )
    db.add(audit)
    db.commit()
    
    trigger_pusher_event(
        event_type="RETURN",
        employee_name=employee.name,
        department=employee.department.name if employee.department else "Sales"
    )
    
    return {"message": "Goal sheet returned for rework successfully."}
