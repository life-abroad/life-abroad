from typing import Sequence
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.media_item import MediaItem, MediaType
from src.infrastructure.repositories.media_item_repository import MediaItemRepository
from src.infrastructure.repositories.post_repository import PostRepository
from src.domain.errors.custom_errors import MediaItemNotFoundError, PostNotFoundError

class MediaItemService:
    def __init__(self):
        self.media_item_repository = MediaItemRepository()
        self.post_repository = PostRepository()

    async def create_media_item(self, post_id: int, path: str, media_type: MediaType, order: int, session: AsyncSession) -> MediaItem:
        # Validate that the post exists
        post = await self.post_repository.get_post_by_id(post_id, session)
        if not post:
            raise PostNotFoundError(post_id)
        
        media_item = MediaItem(post_id=post_id, path=path, type=media_type, order=order)
        return await self.media_item_repository.create_media_item(media_item, session)

    async def get_media_items_by_post_id(self, post_id: int, session: AsyncSession) -> Sequence[MediaItem]:
        # Validate that the post exists
        post = await self.post_repository.get_post_by_id(post_id, session)
        if not post:
            raise PostNotFoundError(post_id)
        
        return await self.media_item_repository.get_media_items_by_post_id(post_id, session)

    async def get_media_item_by_id(self, media_item_id: int, session: AsyncSession) -> MediaItem | None:
        return await self.media_item_repository.get_media_item_by_id(media_item_id, session)

    async def update_media_item(self, media_item_id: int, session: AsyncSession, path: str | None = None, media_type: MediaType | None = None, order: int | None = None) -> MediaItem:
        media_item = await self.media_item_repository.get_media_item_by_id(media_item_id, session)
        if not media_item:
            raise MediaItemNotFoundError(media_item_id)
        
        if path is not None:
            media_item.path = path
        if media_type is not None:
            media_item.type = media_type
        if order is not None:
            media_item.order = order
        
        return await self.media_item_repository.update_media_item(media_item, session)

    async def delete_media_item(self, media_item_id: int, session: AsyncSession) -> None:
        deleted = await self.media_item_repository.delete_media_item(media_item_id, session)
        if not deleted:
            raise MediaItemNotFoundError(media_item_id)

    async def delete_media_items_by_post_id(self, post_id: int, session: AsyncSession) -> None:
        await self.media_item_repository.delete_media_items_by_post_id(post_id, session)
