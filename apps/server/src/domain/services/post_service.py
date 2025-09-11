from typing import Sequence, List
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.post import Post
from src.infrastructure.repositories.post_repository import PostRepository
from ..errors.exceptions import PostNotFoundError

class PostService:
    def __init__(self):
        self.repository = PostRepository()

    async def get_posts(self, session: AsyncSession) -> Sequence[Post]:
        return await self.repository.get_posts(session)

    async def get_post_by_id(self, post_id: int, session: AsyncSession) -> Post | None:
        return await self.repository.get_post_by_id(post_id, session)

    async def create_post(self, description: str, session: AsyncSession, audience_ids: List[int] | None = None) -> Post:
        post = await self.repository.create_post(description, session)
        
        # Assign audiences if provided
        if audience_ids and post.id is not None:
            await self.repository.assign_audiences_to_post(post.id, audience_ids, session)
        
        return post

    async def update_post(self, post_id: int, session: AsyncSession, description: str | None = None, audience_ids: List[int] | None = None) -> Post:
        post = await self.repository.get_post_by_id(post_id, session)
        if not post:
            raise PostNotFoundError()
        
        if description is not None:
            post.description = description
            post = await self.repository.update_post(post, session)
        
        if audience_ids is not None:
            await self.repository.assign_audiences_to_post(post_id, audience_ids, session)
        
        return post

    async def delete_post(self, post_id: int, session: AsyncSession) -> None:
        deleted = await self.repository.delete_post(post_id, session)
        if not deleted:
            raise PostNotFoundError()
