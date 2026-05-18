from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import io
import csv
import uuid
from api.core.database import get_db
from api.models import Goal, User, AuditLog, Department, ThrustArea
from api.schemas import AdminDashboardStats, AuditLogResponse, SharedGoalPush
from api.dependencies import get_current_user, require_role
from api.services import trigger_pusher_event

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard", response_model=AdminDashboardStats)
def get_admin_dashboard_stats(current_user: User = Depends(require_role(["ADMIN"])), db: Session = Depends(get_db)):
    total_employees = db.query(User).filter(User.role == "EMPLOYEE").count()
    
    # Goals submitted count (distinct employees who have submitted sheets)
    goals_submitted = db.query(Goal.user_id).filter(Goal.status == "SUBMITTED").distinct().count()
    
    # Manager approved count (distinct employees whose sheets are locked)
    manager_approved = db.query(Goal.user_id).filter(Goal.status == "LOCKED").distinct().count()
    
    # Check-ins complete count
    from api.models import CheckIn
    check_ins_complete = db.query(CheckIn.goal_id).distinct().count()
    
    return {
        "total_employees": total_employees,
        "goals_submitted": goals_submitted,
        "manager_approved": manager_approved,
        "check_ins_complete": check_ins_complete
    }

@router.get("/audit", response_model=List[AuditLogResponse])
def get_audit_trail(
    action: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog).join(User, AuditLog.user_id == User.id, isouter=True)
    
    if action and action != "ALL":
        query = query.filter(AuditLog.action == action)
        
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) |
            (AuditLog.field_changed.ilike(f"%{search}%")) |
            (AuditLog.new_value.ilike(f"%{search}%"))
        )
        
    logs = query.order_by(AuditLog.timestamp.desc()).all()
    
    response = []
    for log in logs:
        # Fetch associated user details
        user = db.query(User).filter(User.id == log.user_id).first()
        response.append({
            "id": log.id,
            "timestamp": log.timestamp,
            "user_name": user.name if user else "System",
            "user_role": user.role if user else "SYSTEM",
            "action": log.action,
            "field_changed": log.field_changed,
            "old_value": log.old_value,
            "new_value": log.new_value
        })
        
    return response

@router.post("/goals/share")
def push_shared_goal(goal_push: SharedGoalPush, current_user: User = Depends(require_role(["ADMIN"])), db: Session = Depends(get_db)):
    if not goal_push.employee_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID list cannot be empty."
        )
        
    created_goals = []
    for emp_id in goal_push.employee_ids:
        emp = db.query(User).filter(User.id == emp_id, User.role == "EMPLOYEE").first()
        if not emp:
            continue
            
        new_g = Goal(
            id=f"g-{uuid.uuid4().hex[:8]}",
            user_id=emp_id,
            thrust_area_id=goal_push.thrust_area_id,
            title=goal_push.title,
            uom=goal_push.uom,
            target=goal_push.target,
            weightage=0, # Cascaded target metric is pushed as shared department level KPI (0 weightage budget footprint)
            status="LOCKED", # Auto-locked/approved by Admin
            is_cascaded=True
        )
        db.add(new_g)
        created_goals.append(emp.name)
        
    # Audit log cascade
    audit = AuditLog(
        user_id=current_user.id,
        action="CASCADE",
        field_changed="Cascaded Goal",
        old_value="None",
        new_value=goal_push.title
    )
    db.add(audit)
    db.commit()
    
    # WebSocket alert trigger
    trigger_pusher_event(
        event_type="CASCADE",
        employee_name="HR Admin Pushed KPI",
        department="All Departments"
    )
    
    return {"message": f"Successfully cascaded shared goal '{goal_push.title}' to: {', '.join(created_goals)}"}

@router.get("/export/achievements")
def export_achievements_report(current_user: User = Depends(require_role(["ADMIN"])), db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow(["Employee ID", "Employee Name", "Department", "Thrust Area", "Goal Title", "UoM", "Target", "Weightage", "Status", "Is Cascaded"])
    
    goals = db.query(Goal).all()
    for g in goals:
        emp = db.query(User).filter(User.id == g.user_id).first()
        dept = db.query(Department).filter(Department.id == emp.dept_id).first() if emp else None
        ta = db.query(ThrustArea).filter(ThrustArea.id == g.thrust_area_id).first()
        
        writer.writerow([
            g.user_id,
            emp.name if emp else "Unknown",
            dept.name if dept else "N/A",
            ta.name if ta else "N/A",
            g.title,
            g.uom,
            g.target,
            f"{g.weightage}%",
            g.status,
            "Yes" if g.is_cascaded else "No"
        ])
        
    output.seek(0)
    response = StreamingResponse(iter([output.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=GoalFlow_Achievement_Report.csv"
    return response
