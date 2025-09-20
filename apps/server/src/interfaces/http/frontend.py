from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from src.domain.services.auth.view_service import ViewService
from src.infrastructure.database import get_session
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/frontend", tags=["frontend"])
view_service = ViewService()

class MediaItemResponse(BaseModel):
    id: int
    type: str
    url: str

class PostViewResponse(BaseModel):
    post_id: int
    description: str
    creator_name: str
    media_items: List[MediaItemResponse]
    created_at: str

class UserPostsResponse(BaseModel):
    posts: List[PostViewResponse]

@router.get("/view", response_model=PostViewResponse | UserPostsResponse)
async def view_with_token(
    token: str = Query(...), 
    post_id: int | None = Query(None),
    session: AsyncSession = Depends(get_session)
):
    """View a specific post or all user posts using an authenticated token"""
    try:
        result = await view_service.get_view_data_for_token(token, post_id, session)
        
        # Check if it's a single post or multiple posts
        if "post_id" in result:
            return PostViewResponse(**result)
        else:
            return UserPostsResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=404, detail="Content not found")