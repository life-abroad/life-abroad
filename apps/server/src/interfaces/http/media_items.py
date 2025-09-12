from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from src.domain.models.media_item import MediaItem, MediaType
from src.domain.services.media_item_service import MediaItemService
from src.domain.errors.custom_errors import MediaItemNotFoundError, PostNotFoundError
from src.infrastructure.database import get_session
from typing import Sequence, List

router = APIRouter(prefix="/media-items", tags=["media-items"])

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
