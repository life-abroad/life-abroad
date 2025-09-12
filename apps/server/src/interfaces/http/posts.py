from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from src.domain.models.post import Post
from src.domain.models.audience import Audience
from src.domain.services.post_service import PostService
from src.domain.errors.custom_errors import PostNotFoundError, AudienceNotFoundError
from src.infrastructure.database import get_session
from typing import Sequence, List

router = APIRouter(prefix="/posts", tags=["posts"])

class PostWithAudiences(BaseModel):
    id: int
    description: str
    created_at: str
    audiences: List[Audience]

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

@router.get("/{post_id}", response_model=PostWithAudiences)
async def get_post(post_id: int, session: AsyncSession = Depends(get_session)):
    post, audiences = await post_service.get_post_with_audiences(post_id, session)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostWithAudiences(
        id=post.id or 0, 
        description=post.description, 
        created_at=post.created_at.isoformat(),
        audiences=list(audiences)
    )

@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreateRequest, session: AsyncSession = Depends(get_session)):
    try:
        return await post_service.create_post(post.description, session, post.audience_ids)
    except AudienceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{post_id}", response_model=Post)
async def update_post(post_id: int, post: PostUpdateRequest, session: AsyncSession = Depends(get_session)):
    try:
        return await post_service.update_post(post_id, session, post.description, post.audience_ids)
    except PostNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except AudienceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{post_id}", status_code=204)
async def delete_post(post_id: int, session: AsyncSession = Depends(get_session)):
    try:
        await post_service.delete_post(post_id, session)
    except PostNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
