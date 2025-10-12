from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import StreamingResponse
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from src.domain.models.media_item import MediaItem, MediaType
from src.domain.models.user import User
from src.domain.services.media_item_service import MediaItemService
from src.domain.services.post_service import PostService
from src.domain.services.auth.authorization_service import AuthorizationService
from src.domain.errors.custom_errors import MediaItemNotFoundError, PostNotFoundError
from src.infrastructure.database import get_session
from src.infrastructure.storage.media_storage_service import MediaStorageService
from src.infrastructure.auth.dependencies import current_active_user, optional_current_user, get_user_from_view_token
from typing import Sequence, List, Optional
import logging

logger = logging.getLogger(__name__)

# Media items router - authentication handled per endpoint
router = APIRouter(
    prefix="/media-items", 
    tags=["media-items"]
)

# Request models
class MediaItemCreateRequest(BaseModel):
    post_id: int
    path: str
    type: MediaType
    order: int

class MediaItemUpdateRequest(BaseModel):
    path: str | None = None
    type: MediaType | None = None
    order: int | None = None

media_item_service = MediaItemService()
media_storage_service = MediaStorageService()
post_service = PostService()
authorization_service = AuthorizationService()

@router.get("/", response_model=Sequence[MediaItem], dependencies=[Depends(current_active_user)])
async def get_media_items(post_id: int | None = None, session: AsyncSession = Depends(get_session)):
    if post_id:
        try:
            return await media_item_service.get_media_items_by_post_id(post_id, session)
        except PostNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
    raise HTTPException(status_code=400, detail="post_id query parameter is required")

@router.get("/{media_item_id}", response_model=MediaItem, dependencies=[Depends(current_active_user)])
async def get_media_item(media_item_id: int, session: AsyncSession = Depends(get_session)):
    media_item = await media_item_service.get_media_item_by_id(media_item_id, session)
    if not media_item:
        raise HTTPException(status_code=404, detail="Media item not found")
    return media_item

@router.post("/", response_model=MediaItem, status_code=status.HTTP_201_CREATED, dependencies=[Depends(current_active_user)])
async def create_media_item(media_item: MediaItemCreateRequest, session: AsyncSession = Depends(get_session)):
    try:
        return await media_item_service.create_media_item(
            media_item.post_id, 
            media_item.path, 
            media_item.type, 
            media_item.order, 
            session
        )
    except PostNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Database constraint violation. Please check your data.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred while creating the media item.")

@router.put("/{media_item_id}", response_model=MediaItem, dependencies=[Depends(current_active_user)])
async def update_media_item(media_item_id: int, media_item: MediaItemUpdateRequest, session: AsyncSession = Depends(get_session)):
    try:
        return await media_item_service.update_media_item(
            media_item_id, 
            session, 
            media_item.path, 
            media_item.type, 
            media_item.order
        )
    except MediaItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{media_item_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(current_active_user)])
async def delete_media_item(media_item_id: int, session: AsyncSession = Depends(get_session)):
    try:
        await media_item_service.delete_media_item(media_item_id, session)
    except MediaItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/upload", response_model=MediaItem, status_code=status.HTTP_201_CREATED, dependencies=[Depends(current_active_user)])
async def upload_media_file(
    post_id: int = Form(...),
    order: int = Form(0),
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_session)
):
    """
    Upload a media file and create a media item record
    """
    try:
        # Get the post to retrieve user_id for structured storage
        post = await post_service.get_post_by_id(post_id, session)
        if not post:
            raise HTTPException(status_code=404, detail=f"Post with id {post_id} not found")
        
        # Validate file type
        if not file.content_type:
            raise HTTPException(status_code=400, detail="File content type is required")
        
        # Determine media type based on content type
        if file.content_type.startswith('image/'):
            media_type = MediaType.photo
        elif file.content_type.startswith('video/'):
            media_type = MediaType.video
        else:
            raise HTTPException(status_code=400, detail="Only image and video files are supported")
        
        # Validate file size (10MB limit)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")
        
        # Reset file pointer
        await file.seek(0)
        
        # Upload file to MinIO with structured path
        file_path = media_storage_service.upload_file(
            file_data=file.file,
            file_name=file.filename or "unknown",
            content_type=file.content_type,
            user_id=post.user_id,
            post_id=post_id
        )
        
        # Create media item record
        media_item = await media_item_service.create_media_item(
            post_id=post_id,
            path=file_path,
            media_type=media_type,
            order=order,
            session=session
        )
        
        logger.info(f"Uploaded media file: {file_path} for post {post_id}")
        return media_item
        
    except PostNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload file")

@router.get("/{media_item_id}/stream")
async def get_media_file_stream(
    media_item_id: int,
    token: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_session),
    auth_user: Optional[User] = Depends(optional_current_user),
    view_token_user: Optional[User] = Depends(get_user_from_view_token)
):
    """
    Stream a media file directly.
    Supports both authenticated users (via JWT) and view token access (via query param or header).
    """
    try:
        # Check authentication - accept either regular auth or view token
        user = auth_user or view_token_user
        payload = None
        
        # If no user from dependencies, check query string token
        if not user and token:
            payload = authorization_service.verify_token(token)
            if payload and payload.get("type") == "view":
                user_id = payload.get("sub")
                if user_id:
                    from src.infrastructure.repositories.user_repository import UserRepository
                    user_repo = UserRepository()
                    user = await user_repo.get_user_by_id(int(user_id), session)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to access media"
            )
        
        # Get media item
        media_item = await media_item_service.get_media_item_by_id(media_item_id, session)
        if not media_item:
            raise HTTPException(status_code=404, detail="Media item not found")
        
        # Verify user has access to the post containing this media item
        post = await post_service.get_post_by_id(media_item.post_id, session)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Authorization: Either user owns the post or is accessing via valid view token
        # View tokens are already validated for post access at the /frontend/view endpoint
        # So if they have a valid view token, we trust they have access
        is_owner = post.user_id == user.id
        has_view_token = view_token_user is not None or (payload is not None and payload.get("type") == "view")
        
        if not (is_owner or has_view_token):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this media"
            )
        
        # Get file stream from domain service
        file_stream, content_type, content_length = media_item_service.get_media_item_stream(media_item.path)
        
        logger.info(f"Streaming media item {media_item_id}: {content_type}, {content_length} bytes (user: {user.id})")
        
        return StreamingResponse(
            file_stream,
            media_type=content_type,
            headers={
                "Content-Length": str(content_length),
                "Cache-Control": "public, max-age=3600"  # Cache for 1 hour
            }
        )
        
    except Exception as e:
        logger.error(f"Error streaming file: {e}")
        raise HTTPException(status_code=500, detail="Failed to stream file")
