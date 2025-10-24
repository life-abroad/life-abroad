from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from src.domain.models.post import Post
from src.domain.models.audience import Audience
from src.domain.models.user import User
from src.domain.models.media_item import MediaItem
from src.domain.services.post_service import PostService
from src.domain.services.notifications.notification_service import NotificationService
from src.domain.errors.custom_errors import PostNotFoundError, AudienceNotFoundError, UserNotFoundError
from src.infrastructure.database import get_session
from src.infrastructure.auth.dependencies import current_active_user
from typing import Sequence, List, Optional

# Protect ALL routes in this router with authentication
router = APIRouter(
    prefix="/posts", 
    tags=["posts"],
    dependencies=[Depends(current_active_user)]
)

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
    media_items: List[MediaItem]

# Create request models
class PostCreateRequest(BaseModel):
    description: str
    audience_ids: List[int] | None = None

class PostUpdateRequest(BaseModel):
    description: str | None = None
    audience_ids: List[int] | None = None

post_service = PostService()
notification_service = NotificationService()

@router.get("/", response_model=Sequence[Post])
async def get_posts(
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Get all posts created by the authenticated user"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    try:
        return await post_service.get_posts_by_user(current_user.id, session)
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{post_id}", response_model=PostWithUserAndAudiences)
async def get_post(
    post_id: int,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Get a specific post (only the owner can view)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    try:
        # Check if current_user owns this post
        post, user, audiences, media_items = await post_service.get_post_with_user_and_audiences(post_id, session)
        if post.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to view this post")
        
        return PostWithUserAndAudiences(
            id=post.id or 0, 
            description=post.description,
            created_at=str(post.created_at),
            user=user,
            audiences=list(audiences),
            media_items=list(media_items)
        )
    except PostNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostCreateRequest,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new post for the authenticated user"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    # Filter audience_ids to only include those owned by the current user
    filtered_audience_ids = None
    if post.audience_ids:
        user_audiences = await post_service.get_audiences_by_user(current_user.id, session)
        user_audience_ids = {audience.id for audience in user_audiences if audience.id is not None}
        filtered_audience_ids = [audience_id for audience_id in post.audience_ids if audience_id in user_audience_ids]
        
        # If user provided audience_ids but none are valid (owned by user), reject the request
        if not filtered_audience_ids:
            raise HTTPException(
                status_code=400, 
                detail="Invalid audience IDs provided"
            )
    
    try:
        created_post = await post_service.create_post(
            post.description, 
            current_user.id,
            session, 
            filtered_audience_ids
        )
        
        # Send notifications through domain service
        await notification_service.notify_audiences_of_new_post(
            created_post.id or 0, 
            filtered_audience_ids, 
            session
        )
        return created_post
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except AudienceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{post_id}", response_model=Post)
async def update_post(
    post_id: int, 
    post: PostUpdateRequest,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Update a post (only the owner can update)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    # Filter audience_ids to only include those owned by the current user
    filtered_audience_ids = None
    if post.audience_ids:
        user_audiences = await post_service.get_audiences_by_user(current_user.id, session)
        user_audience_ids = {audience.id for audience in user_audiences if audience.id is not None}
        filtered_audience_ids = [audience_id for audience_id in post.audience_ids if audience_id in user_audience_ids]
        
        # If user provided audience_ids but none are valid (owned by user), reject the request
        if not filtered_audience_ids:
            raise HTTPException(
                status_code=400, 
                detail="Invalid audience IDs provided"
            )
    
    try:
        # Check if current_user owns this post
        existing_post, _, _, _ = await post_service.get_post_with_user_and_audiences(post_id, session)
        if existing_post.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this post")
        
        return await post_service.update_post(post_id, session, post.description, filtered_audience_ids)
    except PostNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except AudienceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Delete a post (only the owner can delete)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    try:
        # Check if current_user owns this post
        existing_post, _, _, _ = await post_service.get_post_with_user_and_audiences(post_id, session)
        if existing_post.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this post")
        
        await post_service.delete_post(post_id, session)
    except PostNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
