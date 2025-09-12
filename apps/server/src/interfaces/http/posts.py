from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from src.domain.models.post import Post
from src.domain.models.audience import Audience
from src.domain.models.user import User
from src.domain.services.post_service import PostService
from src.domain.errors.custom_errors import PostNotFoundError, AudienceNotFoundError, UserNotFoundError
from src.infrastructure.database import get_session
from typing import Sequence, List

router = APIRouter(prefix="/posts", tags=["posts"])

class PostWithAudiences(BaseModel):
    id: int
    description: str
    created_at: str
    audiences: List[Audience]

class PostWithUserAndAudiences(BaseModel):
    id: int
    description: str
    created_at: str
    user: User
    audiences: List[Audience]

# Create request models
class PostCreateRequest(BaseModel):
    description: str
    user_id: int
    audience_ids: List[int] | None = None

class PostUpdateRequest(BaseModel):
    description: str | None = None
    audience_ids: List[int] | None = None

post_service = PostService()

@router.get("/", response_model=Sequence[Post])
async def get_posts(user_id: int | None = None, session: AsyncSession = Depends(get_session)):
    if user_id:
        try:
            return await post_service.get_posts_by_user(user_id, session)
        except UserNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
    return await post_service.get_posts(session)

@router.get("/{post_id}", response_model=PostWithUserAndAudiences)
async def get_post(post_id: int, session: AsyncSession = Depends(get_session)):
    post, user, audiences = await post_service.get_post_with_user_and_audiences(post_id, session)
    if not post or not user:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostWithUserAndAudiences(
        id=post.id or 0, 
        description=post.description,
        created_at=str(post.created_at),
        user=user,
        audiences=list(audiences)
    )

@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreateRequest, session: AsyncSession = Depends(get_session)):
    try:
        return await post_service.create_post(post.description, post.user_id, session, post.audience_ids)
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
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

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: int, session: AsyncSession = Depends(get_session)):
    try:
        await post_service.delete_post(post_id, session)
    except PostNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
