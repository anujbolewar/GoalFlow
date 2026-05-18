from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import datetime

# AUTH SCHEMAS
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    dept_id: Optional[str]
    manager_id: Optional[str]

    class Config:
        from_attributes = True

# GOAL SCHEMAS
class GoalCreate(BaseModel):
    thrust_area_id: str
    title: str = Field(..., max_length=80)
    uom: str # NUMERIC, PERCENTAGE, TIMELINE, ZERO_BASED
    target: float
    weightage: int = Field(..., ge=10, le=100)

class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=80)
    target: Optional[float] = None
    weightage: Optional[int] = Field(None, ge=10, le=100)

class GoalResponse(BaseModel):
    id: str
    user_id: str
    thrust_area_id: str
    title: str
    uom: str
    target: float
    weightage: int
    status: str
    is_cascaded: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class GoalListResponse(BaseModel):
    goals: List[GoalResponse]
    total_weightage: int
    remaining_weightage: int
    status: str

# CHECK-IN SCHEMAS
class CheckInCreate(BaseModel):
    goal_id: str
    quarter: str
    actual: float

class CheckInResponse(BaseModel):
    id: str
    goal_id: str
    quarter: str
    actual: float
    manager_comment: Optional[str]
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# TEAM SCHEMAS (Manager)
class TeamMemberResponse(BaseModel):
    id: str
    name: str
    department: str
    goals_count: int
    weightage: int
    status: str

class GoalSheetResponse(BaseModel):
    employee_name: str
    goals: List[GoalResponse]
    total_weightage: int
    status: str

class ReworkRequest(BaseModel):
    comment: str

class ManagerGoalEdit(BaseModel):
    target: Optional[float] = None
    weightage: Optional[int] = None

# ADMIN SCHEMAS
class AdminDashboardStats(BaseModel):
    total_employees: int
    goals_submitted: int
    manager_approved: int
    check_ins_complete: int

class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime.datetime
    user_name: Optional[str]
    user_role: Optional[str]
    action: str
    field_changed: Optional[str]
    old_value: Optional[str]
    new_value: Optional[str]

    class Config:
        from_attributes = True

class SharedGoalPush(BaseModel):
    employee_ids: List[str]
    thrust_area_id: str
    title: str = Field(..., max_length=80)
    uom: str
    target: float

# AI SCHEMAS
class AISuggestionInput(BaseModel):
    thrust_area: str
    employee_role: str
    department: str

class AISuggestionResponse(BaseModel):
    title: str
    description: str
    uom_type: str
    suggested_target: float
    weightage_suggestion: int
    rationale: str
