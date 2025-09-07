from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.post import Post, PostCreate
from src.domain.services.post_service import PostService
from src.domain.errors.exceptions import PostNotFoundError
from src.infrastructure.repositories.post_repository import PostRepository
from src.infrastructure.database import get_session
from typing import Sequence

router = APIRouter(prefix="/posts", tags=["posts"])

post_service = PostService(PostRepository())

@router.get("/", response_model=Sequence[Post])
async def get_posts(session: AsyncSession = Depends(get_session)):
    return await post_service.get_posts(session)

@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate, session: AsyncSession = Depends(get_session)):
    return await post_service.create_post(post, session)

@router.delete("/{post_id}", status_code=204)
async def delete_post(post_id: int, session: AsyncSession = Depends(get_session)):
    try:
        await post_service.delete_post(post_id, session)
    except PostNotFoundError:
        raise HTTPException(status_code=404, detail="Post not found")
