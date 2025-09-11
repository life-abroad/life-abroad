from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from src.domain.models.post import Post
from src.domain.services.post_service import PostService
from src.domain.errors.exceptions import PostNotFoundError
from src.infrastructure.database import get_session
from typing import Sequence, List

router = APIRouter(prefix="/posts", tags=["posts"])

# Create request models
class PostCreateRequest(BaseModel):
    description: str
    audience_ids: List[int] | None = None

class PostUpdateRequest(BaseModel):
    description: str | None = None
    audience_ids: List[int] | None = None

post_service = PostService()

@router.get("/", response_model=Sequence[Post])
async def get_posts(session: AsyncSession = Depends(get_session)):
    return await post_service.get_posts(session)

@router.get("/{post_id}", response_model=Post)
async def get_post(post_id: int, session: AsyncSession = Depends(get_session)):
    post = await post_service.get_post_by_id(post_id, session)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreateRequest, session: AsyncSession = Depends(get_session)):
    return await post_service.create_post(post.description, session, post.audience_ids)

@router.put("/{post_id}", response_model=Post)
async def update_post(post_id: int, post: PostUpdateRequest, session: AsyncSession = Depends(get_session)):
    try:
        return await post_service.update_post(post_id, session, post.description, post.audience_ids)
    except PostNotFoundError:
        raise HTTPException(status_code=404, detail="Post not found")

@router.delete("/{post_id}", status_code=204)
async def delete_post(post_id: int, session: AsyncSession = Depends(get_session)):
    try:
        await post_service.delete_post(post_id, session)
    except PostNotFoundError:
        raise HTTPException(status_code=404, detail="Post not found")
