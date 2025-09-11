from sqlmodel import SQLModel, Field, Enum
from typing import Optional
from enum import Enum as PyEnum

class MediaType(PyEnum):
    photo = "photo"
    video = "video"

class MediaItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int = Field(foreign_key="post.id")
    path: str
    type: MediaType
    order: int
