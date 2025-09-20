from src.infrastructure.auth.jwt_provider import JwtProvider
from src.domain.services.post_service import PostService
from src.infrastructure.repositories.audience_repository import AudienceRepository
from src.utils.env import get_env_var

class AuthorizationService:
    """Domain service for handling authentication and authorization"""
    
    def __init__(self):
        self.jwt_provider = JwtProvider()
        self.post_service = PostService()
        self.audience_repository = AudienceRepository()
    
    async def generate_user_link(self, user_id: int, post_id: int, session) -> dict:
        """Generate an authenticated link for a user (validates they can access the specific post)"""
        # Verify user has permission to view this post
        post, _, audiences, _ = await self.post_service.get_post_with_user_and_audiences(post_id, session)
        
        user_in_audience = False
        for audience in audiences:
            if audience.id is not None:
                users = await self.audience_repository.get_users_in_audience(audience.id, session)
                if any(user.id == user_id for user in users):
                    user_in_audience = True
                    break
        
        if not user_in_audience:
            raise PermissionError("User is not authorized to view this post")
        
        # Generate a user token (not post-specific)
        token = self.jwt_provider.create_user_view_token(user_id)
        frontend_url = f"{get_env_var('FRONTEND_URL')}?token={token}"
        
        return {"token": token, "url": frontend_url}
    
    def verify_token(self, token: str) -> dict | None:
        """Verify a JWT token and return its payload"""
        return self.jwt_provider.verify_token(token)
    
    async def can_user_access_post(self, user_id: int, post_id: int, session) -> bool:
        """Check if a user can access a specific post through audience membership"""
        try:
            post, _, audiences, _ = await self.post_service.get_post_with_user_and_audiences(post_id, session)
            
            for audience in audiences:
                if audience.id is not None:
                    users = await self.audience_repository.get_users_in_audience(audience.id, session)
                    if any(user.id == user_id for user in users):
                        return True
            return False
        except Exception:
            return False