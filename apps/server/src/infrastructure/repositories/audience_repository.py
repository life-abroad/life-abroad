from typing import Sequence, List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.domain.models.audience import Audience
from src.domain.models.user import User
from src.domain.models.links.audience_user_link import AudienceUserLink

class AudienceRepository:
    async def create_audience(self, audience: Audience, session: AsyncSession) -> Audience:
        session.add(audience)
        await session.commit()
        await session.refresh(audience)
        return audience

    async def get_all_audiences(self, session: AsyncSession) -> Sequence[Audience]:
        result = await session.exec(select(Audience))
        return result.all()

    async def get_audiences_by_user(self, user_id: int, session: AsyncSession) -> Sequence[Audience]:
        result = await session.exec(select(Audience).where(Audience.user_id == user_id))
        return result.all()

    async def get_audience_by_id(self, audience_id: int, session: AsyncSession) -> Audience | None:
        return await session.get(Audience, audience_id)

    async def get_users_in_audience(self, audience_id: int, session: AsyncSession) -> Sequence[User]:
        result = await session.exec(
            select(User)
            .join(AudienceUserLink)
            .where(AudienceUserLink.audience_id == audience_id)
        )
        return result.all()

    async def update_audience(self, audience: Audience, session: AsyncSession) -> Audience:
        session.add(audience)
        await session.commit()
        await session.refresh(audience)
        return audience

    async def add_users_to_audience(self, audience_id: int, user_ids: List[int], session: AsyncSession) -> None:
        for user_id in user_ids:
            # Check if link already exists
            exists = await session.exec(
                select(AudienceUserLink).where(
                    AudienceUserLink.audience_id == audience_id,
                    AudienceUserLink.user_id == user_id
                )
            )
            if not exists.first():
                link = AudienceUserLink(audience_id=audience_id, user_id=user_id)
                session.add(link)
        await session.commit()

    async def replace_users_in_audience(self, audience_id: int, user_ids: List[int], session: AsyncSession) -> None:
        # Remove existing links
        existing = await session.exec(
            select(AudienceUserLink).where(AudienceUserLink.audience_id == audience_id)
        )
        for link in existing:
            await session.delete(link)
        
        # Add new links
        for user_id in user_ids:
            link = AudienceUserLink(audience_id=audience_id, user_id=user_id)
            session.add(link)
        await session.commit()

    async def delete_audience(self, audience_id: int, session: AsyncSession) -> bool:
        audience = await session.get(Audience, audience_id)
        if not audience:
            return False
        
        # Remove all user links first
        existing_links = await session.exec(
            select(AudienceUserLink).where(AudienceUserLink.audience_id == audience_id)
        )
        for link in existing_links:
            await session.delete(link)
        
        # Delete the audience
        await session.delete(audience)
        await session.commit()
        return True
