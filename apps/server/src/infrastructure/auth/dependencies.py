"""
Authentication dependencies for FastAPI Users and view token system.
This module provides dependencies for protecting routes and supporting both authentication methods.
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from sqlmodel.ext.asyncio.session import AsyncSession
from src.infrastructure.auth.jwt_provider import JwtProvider
from src.infrastructure.auth.fastapi_users_config import current_active_user, optional_current_user
from src.domain.models.user import User
from src.infrastructure.repositories.user_repository import UserRepository
from src.infrastructure.database import get_session


# Header for view tokens (used for shareable links)
view_token_header = APIKeyHeader(name="X-View-Token", auto_error=False)


class AuthDependencies:
    """Authentication dependencies for route protection"""
    
    def __init__(self):
        self.jwt_provider = JwtProvider()
        self.user_repository = UserRepository()
    
    async def get_user_from_view_token(
        self,
        token: Optional[str] = Depends(view_token_header),
        session: AsyncSession = Depends(get_session)
    ) -> Optional[User]:
        """
        Get user from view token (X-View-Token header).
        Returns None if no token or invalid token.
        Used for public endpoints that need to identify users from shared links.
        """
        if not token:
            return None
        
        payload = self.jwt_provider.verify_token(token)
        if not payload:
            return None
        
        # Only accept view tokens for this dependency
        if payload.get("type") != "view":
            return None
        
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        user = await self.user_repository.get_user_by_id(int(user_id), session)
        return user
    
    async def require_user_from_view_token(
        self,
        token: Optional[str] = Depends(view_token_header),
        session: AsyncSession = Depends(get_session)
    ) -> User:
        """
        Require a valid user from view token.
        Raises 401 if token is missing or invalid.
        """
        user = await self.get_user_from_view_token(token, session)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing view token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user


# Create singleton instance
auth_dependencies = AuthDependencies()


# Export dependencies for use in routes
get_user_from_view_token = auth_dependencies.get_user_from_view_token
require_user_from_view_token = auth_dependencies.require_user_from_view_token

# Re-export FastAPI Users dependencies for convenience
__all__ = [
    "current_active_user",
    "optional_current_user",
    "get_user_from_view_token",
    "require_user_from_view_token",
]
