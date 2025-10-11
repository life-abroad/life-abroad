from typing import Sequence
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.contact import Contact
from src.infrastructure.repositories.contact_repository import ContactRepository
from src.domain.errors.custom_errors import UserNotFoundError
from src.infrastructure.repositories.user_repository import UserRepository

class ContactService:
    def __init__(self):
        self.contact_repository = ContactRepository()
        self.user_repository = UserRepository()

    async def create_contact(self, name: str, phone_number: str, email: str | None, profile_picture_id: int | None, user_id: int, session: AsyncSession) -> Contact:
        user = await self.user_repository.get_user_by_id(user_id, session)
        if not user:
            raise UserNotFoundError(user_id)
        
        # Normalize profile_picture_id: convert 0 or invalid values to None
        normalized_profile_picture_id = profile_picture_id if profile_picture_id else None
        
        contact = Contact(name=name, phone_number=phone_number, email=email, profile_picture_id=normalized_profile_picture_id, user_id=user_id)
        return await self.contact_repository.create_contact(contact, session)

    async def get_contact_by_id(self, contact_id: int, session: AsyncSession) -> Contact | None:
        return await self.contact_repository.get_contact_by_id(contact_id, session)

    async def list_contacts(self, session: AsyncSession) -> Sequence[Contact]:
        return await self.contact_repository.get_all_contacts(session)

    async def get_contacts_by_user(self, user_id: int, session: AsyncSession) -> Sequence[Contact]:
        user = await self.user_repository.get_user_by_id(user_id, session)
        if not user:
            raise UserNotFoundError(user_id)
        return await self.contact_repository.get_contacts_by_user(user_id, session)

    async def update_contact(self, contact_id: int, name: str | None, phone_number: str | None, email: str | None, profile_picture_id: int | None, session: AsyncSession) -> Contact:
        contact = await self.contact_repository.get_contact_by_id(contact_id, session)
        if not contact:
            raise ValueError(f"Contact with id {contact_id} not found")
        
        if name is not None:
            contact.name = name
        if phone_number is not None:
            contact.phone_number = phone_number
        if email is not None:
            contact.email = email
        if profile_picture_id is not None:
            # Normalize profile_picture_id: convert 0 or invalid values to None
            contact.profile_picture_id = profile_picture_id if profile_picture_id else None
        
        return await self.contact_repository.update_contact(contact, session)

    async def delete_contact(self, contact_id: int, session: AsyncSession) -> None:
        deleted = await self.contact_repository.delete_contact(contact_id, session)
        if not deleted:
            raise ValueError(f"Contact with id {contact_id} not found")
