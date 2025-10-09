from typing import Optional
from pydantic import EmailStr
from fastapi_users import schemas
from datetime import datetime


class UserRead(schemas.BaseUser[int]):
    """Schema for reading user data"""
    # id, email, is_active, is_verified, is_superuser are inherited from BaseUser
    name: str
    phone_number: str
    created_at: datetime
    updated_at: datetime


class UserCreate(schemas.BaseUserCreate):
    """Schema for creating a new user"""
    name: str
    phone_number: str
    # email and password are already defined in BaseUserCreate
    # is_active, is_verified, is_superuser are also inherited with proper defaults


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating user data"""
    name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
