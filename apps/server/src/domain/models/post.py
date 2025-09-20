from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime
from typing import Optional
from datetime import datetime, timezone

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    description: str
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True))
    )
