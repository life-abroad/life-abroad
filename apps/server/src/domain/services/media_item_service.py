from typing import Sequence, Any
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.media_item import MediaItem, MediaType
from src.infrastructure.repositories.media_item_repository import MediaItemRepository
from src.infrastructure.repositories.post_repository import PostRepository
from src.infrastructure.storage.media_storage_service import MediaStorageService
from src.domain.errors.custom_errors import MediaItemNotFoundError, PostNotFoundError

class MediaItemService:
    def __init__(self, 
                 media_item_repository: MediaItemRepository | None = None,
                 post_repository: PostRepository | None = None,
                 media_storage_service: MediaStorageService | None = None):
        self.media_item_repository = media_item_repository or MediaItemRepository()
        self.post_repository = post_repository or PostRepository()
        self.media_storage_service = media_storage_service or MediaStorageService()

    async def _validate_post_exists(self, post_id: int, session: AsyncSession) -> None:
        """Validate that a post exists, raise PostNotFoundError if not"""
        post = await self.post_repository.get_post_by_id(post_id, session)
        if not post:
            raise PostNotFoundError(post_id)

    async def create_media_item(self, post_id: int, path: str, media_type: MediaType, order: int, session: AsyncSession) -> MediaItem:
        await self._validate_post_exists(post_id, session)
        
        media_item = MediaItem(post_id=post_id, path=path, type=media_type, order=order)
        return await self.media_item_repository.create_media_item(media_item, session)

    async def get_media_items_by_post_id(self, post_id: int, session: AsyncSession) -> Sequence[MediaItem]:
        await self._validate_post_exists(post_id, session)
        return await self.media_item_repository.get_media_items_by_post_id(post_id, session)

    async def get_media_item_by_id(self, media_item_id: int, session: AsyncSession) -> MediaItem | None:
        return await self.media_item_repository.get_media_item_by_id(media_item_id, session)

    async def update_media_item(self, media_item_id: int, session: AsyncSession, 
                              path: str | None = None, 
                              media_type: MediaType | None = None, 
                              order: int | None = None) -> MediaItem:
        media_item = await self.media_item_repository.get_media_item_by_id(media_item_id, session)
        if not media_item:
            raise MediaItemNotFoundError(media_item_id)
        
        # Update only provided fields
        if path is not None:
            media_item.path = path
        if media_type is not None:
            media_item.type = media_type
        if order is not None:
            media_item.order = order
        
        return await self.media_item_repository.update_media_item(media_item, session)

    async def delete_media_item(self, media_item_id: int, session: AsyncSession) -> None:
        media_item = await self.media_item_repository.get_media_item_by_id(media_item_id, session)
        if not media_item:
            raise MediaItemNotFoundError(media_item_id)
        
        # Delete from database
        deleted = await self.media_item_repository.delete_media_item(media_item_id, session)
        if not deleted:
            raise MediaItemNotFoundError(media_item_id)
        
        # Delete the actual file from storage
        self.media_storage_service.delete_file(media_item.path)

    async def delete_media_items_by_post_id(self, post_id: int, session: AsyncSession) -> None:
        """Delete all media items for a post from database only (not storage)"""
        await self.media_item_repository.delete_media_items_by_post_id(post_id, session)
    
    async def delete_post_media_with_files(self, post_id: int, user_id: int, session: AsyncSession) -> int:
        """
        Delete all media items for a post from both database and storage.
        Returns count of files deleted from storage.
        """
        # Delete from database first
        await self.media_item_repository.delete_media_items_by_post_id(post_id, session)
        
        # Delete all files from storage for this post
        deleted_count = self.media_storage_service.delete_post_media(user_id, post_id)
        
        return deleted_count

    def get_media_item_stream(self, file_path: str) -> tuple[Any, str, int]:
        """Get a media item stream for serving"""
        return self.media_storage_service.get_file_stream(file_path)
