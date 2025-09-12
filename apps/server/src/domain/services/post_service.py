from typing import Sequence, List
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.post import Post
from src.domain.models.audience import Audience
from src.domain.models.user import User
from src.domain.models.media_item import MediaItem
from src.infrastructure.repositories.post_repository import PostRepository
from src.infrastructure.repositories.audience_repository import AudienceRepository
from src.infrastructure.repositories.user_repository import UserRepository
from src.infrastructure.repositories.media_item_repository import MediaItemRepository
from src.domain.errors.custom_errors import PostNotFoundError, AudienceNotFoundError, UserNotFoundError

class PostService:
    def __init__(self):
        self.repository = PostRepository()
        self.audience_repository = AudienceRepository()
        self.user_repository = UserRepository()
        self.media_item_repository = MediaItemRepository()

    async def get_posts(self, session: AsyncSession) -> Sequence[Post]:
        return await self.repository.get_posts(session)

    async def get_post_by_id(self, post_id: int, session: AsyncSession) -> Post | None:
        return await self.repository.get_post_by_id(post_id, session)

    async def get_post_with_audiences(self, post_id: int, session: AsyncSession) -> tuple[Post | None, Sequence[Audience]]:
        post = await self.repository.get_post_by_id(post_id, session)
        if not post:
            return None, []
        audiences = await self.repository.get_audiences_for_post(post_id, session)
        return post, audiences

    async def create_post(self, description: str, user_id: int, session: AsyncSession, audience_ids: List[int] | None = None) -> Post:
        # Validate user exists
        user = await self.user_repository.get_user_by_id(user_id, session)
        if not user:
            raise UserNotFoundError(user_id)
        
        # Validate audiences exist
        if audience_ids:
            for audience_id in audience_ids:
                audience = await self.audience_repository.get_audience_by_id(audience_id, session)
                if not audience:
                    raise AudienceNotFoundError(audience_id)
        
        post = await self.repository.create_post(description, user_id, session)
        
        # Assign audiences if provided
        if audience_ids and post.id is not None:
            await self.repository.assign_audiences_to_post(post.id, audience_ids, session)
        
        return post

    async def update_post(self, post_id: int, session: AsyncSession, description: str | None = None, audience_ids: List[int] | None = None) -> Post:
        post = await self.repository.get_post_by_id(post_id, session)
        if not post:
            raise PostNotFoundError(post_id)
        
        # Validate audiences exist
        if audience_ids:
            for audience_id in audience_ids:
                audience = await self.audience_repository.get_audience_by_id(audience_id, session)
                if not audience:
                    raise AudienceNotFoundError(audience_id)
        
        if description is not None:
            post.description = description
            post = await self.repository.update_post(post, session)
        
        if audience_ids is not None:
            await self.repository.assign_audiences_to_post(post_id, audience_ids, session)
        
        return post

    async def delete_post(self, post_id: int, session: AsyncSession) -> None:
        deleted = await self.repository.delete_post(post_id, session)
        if not deleted:
            raise PostNotFoundError(post_id)

    async def get_posts_by_user(self, user_id: int, session: AsyncSession) -> Sequence[Post]:
        # Validate user exists
        user = await self.user_repository.get_user_by_id(user_id, session)
        if not user:
            raise UserNotFoundError(user_id)
        
        return await self.repository.get_posts_by_user(user_id, session)

    async def get_post_with_user_and_audiences(self, post_id: int, session: AsyncSession) -> tuple[Post, User, Sequence[Audience], Sequence[MediaItem]]:
        post = await self.repository.get_post_by_id(post_id, session)
        if not post:
            raise PostNotFoundError(post_id)
        
        user = await self.repository.get_user_for_post(post_id, session)
        if not user:
            raise PostNotFoundError(post_id)  # If no user found, the post is in an invalid state
        
        audiences = await self.repository.get_audiences_for_post(post_id, session)
        media_items = await self.media_item_repository.get_media_items_by_post_id(post_id, session)
        return post, user, audiences, media_items
