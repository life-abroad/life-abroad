from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.services.auth.authorization_service import AuthorizationService
from src.infrastructure.database import get_session
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])
authorization_service = AuthorizationService()

class TokenResponse(BaseModel):
    token: str
    url: str

@router.get("/user-link/{user_id}/{post_id}", response_model=TokenResponse)
async def generate_user_link(user_id: int, post_id: int, session: AsyncSession = Depends(get_session)):
    """Generate a user link (validates access to specific post, but token works for all user's posts)"""
    try:
        result = await authorization_service.generate_user_link(user_id, post_id, session)
        return TokenResponse(token=result["token"], url=result["url"])
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=404, detail="Post not found")