from typing import Sequence
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.post import Post, PostCreate
from src.infrastructure.repositories.post_repository import PostRepository
from ..errors.exceptions import PostNotFoundError

class PostService:
    def __init__(self, repository: PostRepository):
        self.repository = repository

    async def get_posts(self, session: AsyncSession) -> Sequence[Post]:
        return await self.repository.get_posts(session)

    async def create_post(self, post_create: PostCreate, session: AsyncSession) -> Post:
        return await self.repository.create_post(post_create, session)

    async def delete_post(self, post_id: int, session: AsyncSession) -> None:
        deleted = await self.repository.delete_post(post_id, session)
        if not deleted:
            raise PostNotFoundError()
