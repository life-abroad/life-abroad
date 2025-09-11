from typing import Sequence, List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.domain.models.post import Post
from src.domain.models.links.post_audience_link import PostAudienceLink

class PostRepository:
    async def get_posts(self, session: AsyncSession) -> Sequence[Post]:
        result = await session.exec(select(Post))
        return result.all()

    async def get_post_by_id(self, post_id: int, session: AsyncSession) -> Post | None:
        return await session.get(Post, post_id)

    async def create_post(self, description: str, session: AsyncSession) -> Post:
        db_post = Post(description=description)
        session.add(db_post)
        await session.commit()
        await session.refresh(db_post)
        return db_post

    async def update_post(self, post: Post, session: AsyncSession) -> Post:
        session.add(post)
        await session.commit()
        await session.refresh(post)
        return post

    async def delete_post(self, post_id: int, session: AsyncSession) -> bool:
        post = await session.get(Post, post_id)
        if not post:
            return False
        await session.delete(post)
        await session.commit()
        return True

    async def assign_audiences_to_post(self, post_id: int, audience_ids: List[int], session: AsyncSession) -> None:
        # Remove existing audience assignments
        existing_links = await session.exec(
            select(PostAudienceLink).where(PostAudienceLink.post_id == post_id)
        )
        for link in existing_links:
            await session.delete(link)
        
        # Add new audience assignments
        for audience_id in audience_ids:
            link = PostAudienceLink(post_id=post_id, audience_id=audience_id)
            session.add(link)
        
        await session.commit()
