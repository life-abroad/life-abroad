from typing import Sequence, List
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.models.audience import Audience
from src.domain.models.contact import Contact
from src.infrastructure.repositories.audience_repository import AudienceRepository
from src.infrastructure.repositories.contact_repository import ContactRepository
from src.infrastructure.repositories.user_repository import UserRepository
from src.domain.errors.custom_errors import AudienceNotFoundError, UserNotFoundError

class AudienceService:
    def __init__(self):
        self.audience_repository = AudienceRepository()
        self.contact_repository = ContactRepository()
        self.user_repository = UserRepository()

    async def create_audience(self, name: str, owner_id: int, contact_ids: List[int], session: AsyncSession) -> Audience:
        # Validate owner exists
        owner = await self.user_repository.get_user_by_id(owner_id, session)
        if not owner:
            raise UserNotFoundError(owner_id)
        
        # Validate all contacts exist and belong to owner
        for contact_id in contact_ids:
            contact = await self.contact_repository.get_contact_by_id(contact_id, session)
            if not contact:
                raise ValueError(f"Contact with id {contact_id} not found")
            if contact.user_id != owner_id:
                raise ValueError(f"Contact {contact_id} does not belong to user {owner_id}")
        
        audience = Audience(name=name, user_id=owner_id)
        created_audience = await self.audience_repository.create_audience(audience, session)
        
        # Link contacts to audience
        assert created_audience.id is not None
        await self.audience_repository.add_contacts_to_audience(created_audience.id, contact_ids, session)
        return created_audience

    async def get_audience_with_contacts(self, audience_id: int, session: AsyncSession) -> tuple[Audience | None, Sequence[Contact]]:
        audience = await self.audience_repository.get_audience_by_id(audience_id, session)
        if not audience:
            return None, []
        contacts = await self.audience_repository.get_contacts_in_audience(audience_id, session)
        return audience, contacts

    async def update_audience(self, audience_id: int, name: str | None, contact_ids: List[int] | None, session: AsyncSession) -> Audience:
        audience = await self.audience_repository.get_audience_by_id(audience_id, session)
        if not audience:
            raise AudienceNotFoundError(audience_id)
        
        if contact_ids is not None:
            # Validate all contacts exist and belong to audience owner
            for contact_id in contact_ids:
                contact = await self.contact_repository.get_contact_by_id(contact_id, session)
                if not contact:
                    raise ValueError(f"Contact with id {contact_id} not found")
                if contact.user_id != audience.user_id:
                    raise ValueError(f"Contact {contact_id} does not belong to audience owner")
        
        if name is not None:
            audience.name = name
            audience = await self.audience_repository.update_audience(audience, session)
        
        if contact_ids is not None:
            # Replace all contacts in audience
            await self.audience_repository.replace_contacts_in_audience(audience_id, contact_ids, session)
        
        return audience

    async def list_audiences(self, session: AsyncSession) -> Sequence[Audience]:
        return await self.audience_repository.get_all_audiences(session)

    async def get_audiences_by_user(self, user_id: int, session: AsyncSession) -> Sequence[Audience]:
        # Validate user exists
        user = await self.user_repository.get_user_by_id(user_id, session)
        if not user:
            raise UserNotFoundError(user_id)
        return await self.audience_repository.get_audiences_by_user(user_id, session)

    async def get_audience_by_id(self, audience_id: int, session: AsyncSession) -> Audience | None:
        return await self.audience_repository.get_audience_by_id(audience_id, session)

    async def delete_audience(self, audience_id: int, session: AsyncSession) -> None:
        deleted = await self.audience_repository.delete_audience(audience_id, session)
        if not deleted:
            raise AudienceNotFoundError(audience_id)
