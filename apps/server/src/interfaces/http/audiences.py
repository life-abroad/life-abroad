from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from src.domain.models.audience import Audience
from src.domain.models.contact import Contact
from src.domain.models.user import User
from src.domain.services.audience_service import AudienceService
from src.domain.errors.custom_errors import AudienceNotFoundError, UserNotFoundError
from src.infrastructure.database import get_session
from src.infrastructure.auth.dependencies import current_active_user
from typing import Sequence, List

# Protect ALL routes in this router with authentication
router = APIRouter(
    prefix="/audiences", 
    tags=["audiences"],
    dependencies=[Depends(current_active_user)]
)

class AudienceWithContacts(BaseModel):
    id: int
    name: str
    contacts: List[Contact]

# Create request models
class AudienceCreateRequest(BaseModel):
    name: str
    contact_ids: List[int]

class AudienceUpdateRequest(BaseModel):
    name: str | None = None
    contact_ids: List[int] | None = None

audience_service = AudienceService()

@router.get("/", response_model=Sequence[Audience])
async def get_audiences(
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Get all audiences owned by the authenticated user"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    try:
        return await audience_service.get_audiences_by_user(current_user.id, session)
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{audience_id}", response_model=AudienceWithContacts)
async def get_audience(
    audience_id: int,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Get a specific audience (only the owner can view)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    audience, contacts = await audience_service.get_audience_with_contacts(audience_id, session)
    if not audience:
        raise HTTPException(status_code=404, detail="Audience not found")
    
    # Check if current_user owns this audience
    if audience.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this audience")
    
    return AudienceWithContacts(id=audience.id or 0, name=audience.name, contacts=list(contacts))

@router.post("/", response_model=Audience, status_code=status.HTTP_201_CREATED)
async def create_audience(
    audience: AudienceCreateRequest,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new audience for the authenticated user"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    try:
        return await audience_service.create_audience(audience.name, current_user.id, audience.contact_ids, session)
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{audience_id}", response_model=Audience)
async def update_audience(
    audience_id: int, 
    audience: AudienceUpdateRequest,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Update an audience (only the owner can update)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    try:
        # Get the audience to check ownership
        existing_audience = await audience_service.get_audience_by_id(audience_id, session)
        if not existing_audience:
            raise AudienceNotFoundError(audience_id)
        
        # Check if current_user owns this audience
        if existing_audience.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this audience")
        
        return await audience_service.update_audience(audience_id, audience.name, audience.contact_ids, session)
    except AudienceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{audience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audience(
    audience_id: int,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Delete an audience (only the owner can delete)"""
    if not current_user.id:
        raise HTTPException(status_code=500, detail="User ID not found")
    
    try:
        # Get the audience to check ownership
        existing_audience = await audience_service.get_audience_by_id(audience_id, session)
        if not existing_audience:
            raise AudienceNotFoundError(audience_id)
        
        # Check if current_user owns this audience
        if existing_audience.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this audience")
        
        await audience_service.delete_audience(audience_id, session)
    except AudienceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
