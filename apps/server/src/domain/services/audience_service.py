from typing import Sequence, List
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.audience import Audience
from src.domain.models.user import User
from src.infrastructure.repositories.audience_repository import AudienceRepository

class AudienceService:
    def __init__(self):
        self.audience_repository = AudienceRepository()

    async def create_audience(self, name: str, user_ids: List[int], session: AsyncSession) -> Audience:
        audience = Audience(name=name)
        created_audience = await self.audience_repository.create_audience(audience, session)
        
        # Link users to audience
        assert created_audience.id is not None
        await self.audience_repository.add_users_to_audience(created_audience.id, user_ids, session)
        return created_audience

    async def get_audience_with_users(self, audience_id: int, session: AsyncSession) -> tuple[Audience | None, Sequence[User]]:
        audience = await self.audience_repository.get_audience_by_id(audience_id, session)
        if not audience:
            return None, []
        users = await self.audience_repository.get_users_in_audience(audience_id, session)
        return audience, users

    async def update_audience(self, audience_id: int, name: str | None, user_ids: List[int] | None, session: AsyncSession) -> Audience:
        audience = await self.audience_repository.get_audience_by_id(audience_id, session)
        if not audience:
            raise ValueError("Audience not found")
        
        if name is not None:
            audience.name = name
            audience = await self.audience_repository.update_audience(audience, session)
        
        if user_ids is not None:
            # Replace all users in audience
            await self.audience_repository.replace_users_in_audience(audience_id, user_ids, session)
        
        return audience

    async def list_audiences(self, session: AsyncSession) -> Sequence[Audience]:
        return await self.audience_repository.get_all_audiences(session)

    async def get_audience_by_id(self, audience_id: int, session: AsyncSession) -> Audience | None:
        return await self.audience_repository.get_audience_by_id(audience_id, session)
