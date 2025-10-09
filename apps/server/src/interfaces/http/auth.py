from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.services.auth.authorization_service import AuthorizationService
from src.infrastructure.database import get_session
from src.infrastructure.auth.fastapi_users_config import (
    fastapi_users,
    jwt_backend,
    current_active_user,
)
from src.infrastructure.auth.schemas import UserRead, UserCreate, UserUpdate
from src.domain.models.user import User
from src.infrastructure.repositories.user_repository import UserRepository
from pydantic import BaseModel
from typing import Sequence

router = APIRouter(prefix="/auth", tags=["auth"])
authorization_service = AuthorizationService()


class TokenResponse(BaseModel):
    token: str
    url: str


# Include FastAPI Users authentication routes
router.include_router(
    fastapi_users.get_auth_router(jwt_backend),
    prefix="/jwt",
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)

router.include_router(
    fastapi_users.get_reset_password_router(),
)

router.include_router(
    fastapi_users.get_verify_router(UserRead),
)

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
)


# Current user profile endpoint
@router.get("/me", response_model=UserRead)
async def get_current_user_profile(user: User = Depends(current_active_user)):
    """Get the profile of the currently authenticated user"""
    return user


# List all users endpoint
@router.get("/users", response_model=Sequence[UserRead])
async def get_all_users(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Get all users in the system (requires authentication)"""
    user_repo = UserRepository()
    users = await user_repo.get_all_users(session)
    return users


# Generate shareable link with view token for non-authenticated access
@router.get("/user-link/{user_id}/{post_id}", response_model=TokenResponse)
async def generate_user_link(
    user_id: int, 
    post_id: int, 
    session: AsyncSession = Depends(get_session)
):
    """
    Generate a shareable link with view token (validates access to specific post, 
    but token works for all user's posts).
    """
    try:
        result = await authorization_service.generate_user_link(user_id, post_id, session)
        return TokenResponse(token=result["token"], url=result["url"])
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=404, detail="Post not found")