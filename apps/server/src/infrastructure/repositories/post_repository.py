from typing import Sequence
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.domain.models.post import Post, PostCreate

class PostRepository:
    async def get_posts(self, session: AsyncSession) -> Sequence[Post]:
        result = await session.exec(select(Post))
        return result.all()

    async def create_post(self, post_create: PostCreate, session: AsyncSession) -> Post:
        db_post = Post(**post_create.model_dump())
        session.add(db_post)
        await session.commit()
        await session.refresh(db_post)
        return db_post

    async def delete_post(self, post_id: int, session: AsyncSession) -> bool:
        post = await session.get(Post, post_id)
        if not post:
            return False
        await session.delete(post)
        await session.commit()
        return True
