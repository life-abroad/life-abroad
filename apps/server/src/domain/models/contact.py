from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone

class Contact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    phone_number: str
    email: Optional[str] = Field(default=None)
    profile_picture_id: Optional[int] = Field(default=None, foreign_key="mediaitem.id")
    user_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
