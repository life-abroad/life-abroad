from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from src.domain.models.contact import Contact
from src.domain.models.user import User
from src.domain.services.contact_service import ContactService
from src.domain.errors.custom_errors import UserNotFoundError
from src.infrastructure.database import get_session
from src.infrastructure.auth.dependencies import current_active_user
from typing import Sequence

router = APIRouter(
    prefix="/contacts", 
    tags=["contacts"],
    dependencies=[Depends(current_active_user)]
)

class ContactCreateRequest(BaseModel):
    name: str
    phone_number: str
    email: str | None = None
    profile_picture_id: int | None = None

class ContactUpdateRequest(BaseModel):
    name: str | None = None
    phone_number: str | None = None
    email: str | None = None
    profile_picture_id: int | None = None

contact_service = ContactService()

@router.get("/", response_model=Sequence[Contact])
async def get_contacts(
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Get all contacts owned by the authenticated user"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    try:
        return await contact_service.get_contacts_by_user(current_user.id, session)
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{contact_id}", response_model=Contact)
async def get_contact(
    contact_id: int,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Get a specific contact (only the owner can view)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    contact = await contact_service.get_contact_by_id(contact_id, session)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    if contact.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this contact")
    
    return contact

@router.post("/", response_model=Contact, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact: ContactCreateRequest,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new contact for the authenticated user"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    try:
        return await contact_service.create_contact(
            contact.name, 
            contact.phone_number, 
            contact.email, 
            contact.profile_picture_id, 
            current_user.id, 
            session
        )
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{contact_id}", response_model=Contact)
async def update_contact(
    contact_id: int, 
    contact: ContactUpdateRequest,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Update a contact (only the owner can update)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    try:
        existing_contact = await contact_service.get_contact_by_id(contact_id, session)
        if not existing_contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        if existing_contact.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this contact")
        
        return await contact_service.update_contact(
            contact_id, 
            contact.name, 
            contact.phone_number, 
            contact.email, 
            contact.profile_picture_id, 
            session
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    contact_id: int,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Delete a contact (only the owner can delete)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    try:
        existing_contact = await contact_service.get_contact_by_id(contact_id, session)
        if not existing_contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        if existing_contact.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this contact")
        
        await contact_service.delete_contact(contact_id, session)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
