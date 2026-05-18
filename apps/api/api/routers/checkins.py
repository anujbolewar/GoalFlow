import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from api.core.database import get_db
from api.models import Goal, CheckIn, User, AuditLog
from api.schemas import CheckInCreate, CheckInResponse
from api.dependencies import get_current_user, require_role
from api.services import trigger_pusher_event

router = APIRouter(prefix="/checkins", tags=["checkins"])

def calculate_progress_score(uom: str, target: float, actual: float) -> float:
    # Safe checks for division by zero
    if target == 0 and uom != "ZERO_BASED":
        return 0.0
        
    uom_upper = uom.upper()
    if uom_upper == "NUMERIC" or uom_upper == "PERCENTAGE":
        # Min optimization: Higher actual than target is better, capped at 1.0 (100%) or standard division
        # Let's support division
        if target == 0:
            return 1.0 if actual > 0 else 0.0
        score = actual / target
        return round(min(score, 1.2) * 100, 2) # Cap at 120% for extreme performance reporting
        
    elif uom_upper == "TIMELINE":
        # Timeline: target is expected milestone completion duration (lower is better)
        # If target days = 10, actual = 8: 10/8 = 125% -> capped at 100% or standard formula
        if actual == 0:
            return 0.0
        score = target / actual
        return round(min(score, 1.0) * 100, 2)
        
    elif uom_upper == "ZERO_BASED":
        # Zero-based: If achievement (downtime/violations) = 0 -> 100% score, else 0%
        return 100.0 if actual == 0 else 0.0
        
    return 0.0

@router.post("/submit", response_model=CheckInResponse, status_code=status.HTTP_201_CREATED)
def submit_checkin(checkin_data: CheckInCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Row-Level Security: Employee can only log check-ins for their own goals
    goal = db.query(Goal).filter(Goal.id == checkin_data.goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found or unauthorized access."
        )

    # Goal must be locked (approved) before logging achievement
    if goal.status != "LOCKED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit check-in on a goal that is not in APPROVED/LOCKED state."
        )

    # Check if a check-in for this quarter already exists
    existing = db.query(CheckIn).filter(
        CheckIn.goal_id == checkin_data.goal_id, 
        CheckIn.quarter == checkin_data.quarter
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Check-in already logged for goal under quarter {checkin_data.quarter}."
        )

    score = calculate_progress_score(goal.uom, goal.target, checkin_data.actual)

    new_ci = CheckIn(
        id=f"ci-{uuid.uuid4().hex[:8]}",
        goal_id=checkin_data.goal_id,
        quarter=checkin_data.quarter,
        actual=checkin_data.actual,
        manager_comment=f"System calculated progress score: {score}%",
        status="SUBMITTED"
    )
    
    db.add(new_ci)
    
    # Audit trail
    audit = AuditLog(
        user_id=current_user.id,
        action="CHECKIN",
        field_changed="Actuals",
        old_value="None",
        new_value=f"Quarter {checkin_data.quarter} actual: {checkin_data.actual} (Score: {score}%)"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(new_ci)

    # Trigger Pusher WebSocket live telemetry updates
    trigger_pusher_event(
        event_type="CHECKIN",
        employee_name=current_user.name,
        department=current_user.department.name if current_user.department else "Sales"
    )

    return new_ci

@router.get("/team/{manager_id}", response_model=List[CheckInResponse])
def get_team_checkins(manager_id: str, current_user: User = Depends(require_role(["MANAGER", "ADMIN"])), db: Session = Depends(get_db)):
    # Row-Level Security: Only allowed to inspect direct reports
    if current_user.role == "MANAGER" and current_user.id != manager_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Managers can only view achievements of their own reports."
        )
        
    checkins = db.query(CheckIn).join(Goal).join(User).filter(User.manager_id == manager_id).all()
    return checkins
