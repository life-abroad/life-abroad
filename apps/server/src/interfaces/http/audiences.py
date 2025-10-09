from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from src.domain.models.audience import Audience
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

class AudienceWithUsers(BaseModel):
    id: int
    name: str
    users: List[User]

# Create request models
class AudienceCreateRequest(BaseModel):
    name: str
    user_ids: List[int]

class AudienceUpdateRequest(BaseModel):
    name: str | None = None
    user_ids: List[int] | None = None

audience_service = AudienceService()

@router.get("/", response_model=Sequence[Audience])
async def get_audiences(session: AsyncSession = Depends(get_session)):
    """Get all audiences"""
    return await audience_service.list_audiences(session)

@router.get("/{audience_id}", response_model=AudienceWithUsers)
async def get_audience(audience_id: int, session: AsyncSession = Depends(get_session)):
    """Get a specific audience"""
    audience, users = await audience_service.get_audience_with_users(audience_id, session)
    if not audience:
        raise HTTPException(status_code=404, detail="Audience not found")
    return AudienceWithUsers(id=audience.id or 0, name=audience.name, users=list(users))

@router.post("/", response_model=Audience, status_code=status.HTTP_201_CREATED)
async def create_audience(
    audience: AudienceCreateRequest, 
    session: AsyncSession = Depends(get_session)
):
    """Create a new audience"""
    try:
        return await audience_service.create_audience(audience.name, audience.user_ids, session)
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{audience_id}", response_model=Audience)
async def update_audience(
    audience_id: int, 
    audience: AudienceUpdateRequest, 
    session: AsyncSession = Depends(get_session)
):
    """Update an audience"""
    try:
        return await audience_service.update_audience(audience_id, audience.name, audience.user_ids, session)
    except AudienceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{audience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audience(audience_id: int, session: AsyncSession = Depends(get_session)):
    """Delete an audience"""
    try:
        await audience_service.delete_audience(audience_id, session)
    except AudienceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
