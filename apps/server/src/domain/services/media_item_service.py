from typing import Sequence
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.media_item import MediaItem, MediaType
from src.infrastructure.repositories.media_item_repository import MediaItemRepository

class MediaItemService:
    def __init__(self):
        self.media_item_repository = MediaItemRepository()

    async def create_media_item(self, post_id: int, path: str, media_type: MediaType, order: int, session: AsyncSession) -> MediaItem:
        media_item = MediaItem(post_id=post_id, path=path, type=media_type, order=order)
        return await self.media_item_repository.create_media_item(media_item, session)

    async def get_media_items_by_post_id(self, post_id: int, session: AsyncSession) -> Sequence[MediaItem]:
        return await self.media_item_repository.get_media_items_by_post_id(post_id, session)

    async def get_media_item_by_id(self, media_item_id: int, session: AsyncSession) -> MediaItem | None:
        return await self.media_item_repository.get_media_item_by_id(media_item_id, session)

    async def update_media_item(self, media_item_id: int, session: AsyncSession, path: str | None = None, media_type: MediaType | None = None, order: int | None = None) -> MediaItem:
        media_item = await self.media_item_repository.get_media_item_by_id(media_item_id, session)
        if not media_item:
            raise ValueError("Media item not found")
        
        if path is not None:
            media_item.path = path
        if media_type is not None:
            media_item.type = media_type
        if order is not None:
            media_item.order = order
        
        return await self.media_item_repository.update_media_item(media_item, session)

    async def delete_media_item(self, media_item_id: int, session: AsyncSession) -> bool:
        return await self.media_item_repository.delete_media_item(media_item_id, session)

    async def delete_media_items_by_post_id(self, post_id: int, session: AsyncSession) -> None:
        await self.media_item_repository.delete_media_items_by_post_id(post_id, session)
