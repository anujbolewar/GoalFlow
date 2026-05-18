from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from api.schemas import AISuggestionInput, AISuggestionResponse
from api.dependencies import get_current_user
from api.models import User
from api.services import get_claude_goal_suggestions

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/suggest-goals", response_model=List[AISuggestionResponse])
def suggest_goals(input_data: AISuggestionInput, current_user: User = Depends(get_current_user)):
    try:
        suggestions = get_claude_goal_suggestions(
            thrust_area=input_data.thrust_area,
            employee_role=input_data.employee_role,
            department=input_data.department
        )
        return suggestions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Claude Coach engine failure: {e}"
        )
