from typing import Sequence
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.domain.models.user import User

class UserRepository:
    async def create_user(self, user: User, session: AsyncSession) -> User:
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    async def get_all_users(self, session: AsyncSession) -> Sequence[User]:
        result = await session.exec(select(User))
        return result.all()

    async def get_user_by_id(self, user_id: int, session: AsyncSession) -> User | None:
        return await session.get(User, user_id)
