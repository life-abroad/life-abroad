from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from src.domain.models.media_item import MediaItem, MediaType
from src.domain.services.media_item_service import MediaItemService
from src.domain.errors.custom_errors import MediaItemNotFoundError, PostNotFoundError
from src.infrastructure.database import get_session
from src.infrastructure.storage.media_storage_service import MediaStorageService
from src.infrastructure.auth.dependencies import current_active_user
from typing import Sequence, List
import logging

logger = logging.getLogger(__name__)

# Protect ALL routes in this router with authentication
router = APIRouter(
    prefix="/media-items", 
    tags=["media-items"],
    dependencies=[Depends(current_active_user)]
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

@router.get("/", response_model=Sequence[MediaItem])
async def get_media_items(post_id: int | None = None, session: AsyncSession = Depends(get_session)):
    if post_id:
        try:
            return await media_item_service.get_media_items_by_post_id(post_id, session)
        except PostNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
    raise HTTPException(status_code=400, detail="post_id query parameter is required")

@router.get("/{media_item_id}", response_model=MediaItem)
async def get_media_item(media_item_id: int, session: AsyncSession = Depends(get_session)):
    media_item = await media_item_service.get_media_item_by_id(media_item_id, session)
    if not media_item:
        raise HTTPException(status_code=404, detail="Media item not found")
    return media_item

@router.post("/", response_model=MediaItem, status_code=status.HTTP_201_CREATED)
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

@router.put("/{media_item_id}", response_model=MediaItem)
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

@router.delete("/{media_item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media_item(media_item_id: int, session: AsyncSession = Depends(get_session)):
    try:
        await media_item_service.delete_media_item(media_item_id, session)
    except MediaItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/upload", response_model=MediaItem, status_code=status.HTTP_201_CREATED)
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
        
        # Upload file to MinIO
        file_path = media_storage_service.upload_file(
            file_data=file.file,
            file_name=file.filename or "unknown",
            content_type=file.content_type
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
async def get_media_file_stream(media_item_id: int, session: AsyncSession = Depends(get_session)):
    """
    Stream a media file directly
    """
    try:
        media_item = await media_item_service.get_media_item_by_id(media_item_id, session)
        if not media_item:
            raise HTTPException(status_code=404, detail="Media item not found")
        
        # Get file stream from domain service
        file_stream, content_type, content_length = media_item_service.get_media_item_stream(media_item.path)
        
        logger.info(f"Streaming media item {media_item_id}: {content_type}, {content_length} bytes")
        
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
