from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime
from typing import Optional
from datetime import datetime, timezone

class PostBase(SQLModel):
    title: str
    content: str

class Post(PostBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True))
    )

class PostCreate(PostBase):
    pass
