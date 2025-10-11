from typing import Sequence, List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.domain.models.contact import Contact

class ContactRepository:
    async def create_contact(self, contact: Contact, session: AsyncSession) -> Contact:
        session.add(contact)
        await session.commit()
        await session.refresh(contact)
        return contact

    async def get_all_contacts(self, session: AsyncSession) -> Sequence[Contact]:
        result = await session.exec(select(Contact))
        return result.all()

    async def get_contacts_by_user(self, user_id: int, session: AsyncSession) -> Sequence[Contact]:
        result = await session.exec(select(Contact).where(Contact.user_id == user_id))
        return result.all()

    async def get_contact_by_id(self, contact_id: int, session: AsyncSession) -> Contact | None:
        return await session.get(Contact, contact_id)

    async def update_contact(self, contact: Contact, session: AsyncSession) -> Contact:
        session.add(contact)
        await session.commit()
        await session.refresh(contact)
        return contact

    async def delete_contact(self, contact_id: int, session: AsyncSession) -> bool:
        contact = await session.get(Contact, contact_id)
        if not contact:
            return False
        await session.delete(contact)
        await session.commit()
        return True
