from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers, IntegerIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from src.domain.models.user import User
from src.infrastructure.database import get_session
from src.utils.env import get_env_var


# Configuration constants
USER_MANAGER_SECRET = get_env_var("USER_MANAGER_SECRET")
JWT_SECRET_KEY = get_env_var("JWT_SECRET_KEY")
JWT_LIFETIME_SECONDS = 60 * 60 * 24 * 30  # 30 days


async def get_user_db(session: AsyncSession = Depends(get_session)):
    """Dependency to get the user database adapter"""
    yield SQLAlchemyUserDatabase(session, User)


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    """User manager for handling user operations and lifecycle events"""
    
    reset_password_token_secret = USER_MANAGER_SECRET
    verification_token_secret = USER_MANAGER_SECRET
    
    async def on_after_register(self, user: User, request: Optional[Request] = None):
        """Called after a user successfully registers"""
        print(f"User {user.id} ({user.email}) has registered.")
        # TODO: Add logic to send welcome email/SMS
    
    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        """Called after a user requests password reset"""
        print(f"User {user.id} ({user.email}) has requested password reset.")
        # TODO: Add logic to send password reset email with token
    
    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        """Called after a user requests email verification"""
        print(f"Verification requested for user {user.id} ({user.email}).")
        # TODO: Add logic to send verification email with token


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    """Dependency to get the user manager"""
    yield UserManager(user_db)


# JWT Authentication Configuration
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    """Create JWT strategy for authentication"""
    return JWTStrategy(
        secret=JWT_SECRET_KEY,
        lifetime_seconds=JWT_LIFETIME_SECONDS,
    )


# Authentication backend
jwt_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


# FastAPI Users instance
fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [jwt_backend],
)


# Ready-to-use dependencies for route protection
current_active_user = fastapi_users.current_user(active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
current_verified_user = fastapi_users.current_user(active=True, verified=True)
optional_current_user = fastapi_users.current_user(active=True, optional=True)
