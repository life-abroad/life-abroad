from typing import Sequence, List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.domain.models.media_item import MediaItem

class MediaItemRepository:
    async def create_media_item(self, media_item: MediaItem, session: AsyncSession) -> MediaItem:
        session.add(media_item)
        await session.commit()
        await session.refresh(media_item)
        return media_item

    async def get_media_items_by_post_id(self, post_id: int, session: AsyncSession) -> Sequence[MediaItem]:
        result = await session.exec(
            select(MediaItem).where(MediaItem.post_id == post_id)
        )
        return result.all()

    async def get_media_item_by_id(self, media_item_id: int, session: AsyncSession) -> MediaItem | None:
        return await session.get(MediaItem, media_item_id)

    async def update_media_item(self, media_item: MediaItem, session: AsyncSession) -> MediaItem:
        session.add(media_item)
        await session.commit()
        await session.refresh(media_item)
        return media_item

    async def delete_media_item(self, media_item_id: int, session: AsyncSession) -> bool:
        media_item = await session.get(MediaItem, media_item_id)
        if media_item:
            await session.delete(media_item)
            await session.commit()
            return True
        return False

    async def delete_media_items_by_post_id(self, post_id: int, session: AsyncSession) -> None:
        media_items = await session.exec(
            select(MediaItem).where(MediaItem.post_id == post_id)
        )
        for media_item in media_items:
            await session.delete(media_item)
        await session.commit()
