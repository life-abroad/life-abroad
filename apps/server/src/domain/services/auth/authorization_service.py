from src.infrastructure.auth.jwt_provider import JwtProvider
from src.domain.services.post_service import PostService
from src.infrastructure.repositories.audience_repository import AudienceRepository
from src.infrastructure.repositories.contact_repository import ContactRepository
from src.utils.env import get_env_var

class AuthorizationService:
    """Domain service for handling authentication and authorization"""
    
    def __init__(self):
        self.jwt_provider = JwtProvider()
        self.post_service = PostService()
        self.audience_repository = AudienceRepository()
        self.contact_repository = ContactRepository()
    
    async def generate_contact_link(self, contact_id: int, post_id: int, session) -> dict:
        """Generate an authenticated link for a contact (validates they can access the specific post)"""
        # Verify contact has permission to view this post
        contact = await self.contact_repository.get_contact_by_id(contact_id, session)
        if not contact:
            raise ValueError(f"Contact with id {contact_id} not found")
        
        post, _, audiences, _ = await self.post_service.get_post_with_user_and_audiences(post_id, session)
        
        contact_in_audience = False
        for audience in audiences:
            if audience.id is not None:
                contacts = await self.audience_repository.get_contacts_in_audience(audience.id, session)
                if any(c.id == contact_id for c in contacts):
                    contact_in_audience = True
                    break
        
        if not contact_in_audience:
            raise PermissionError("Contact is not authorized to view this post")
        
        # Generate a contact-specific token
        if not contact.id:
            raise ValueError("Contact ID is missing")
        token = self.jwt_provider.create_contact_view_token(contact.id)
        frontend_url = f"{get_env_var('FRONTEND_URL')}?token={token}"
        
        return {"token": token, "url": frontend_url}
    
    def verify_token(self, token: str) -> dict | None:
        """Verify a JWT token and return its payload"""
        return self.jwt_provider.verify_token(token)
    
    async def can_contact_access_post(self, contact_id: int, post_id: int, session) -> bool:
        """Check if a contact can access a specific post through audience membership"""
        try:
            contact = await self.contact_repository.get_contact_by_id(contact_id, session)
            if not contact:
                return False
            
            post, _, audiences, _ = await self.post_service.get_post_with_user_and_audiences(post_id, session)
            
            for audience in audiences:
                if audience.id is not None:
                    contacts = await self.audience_repository.get_contacts_in_audience(audience.id, session)
                    if any(c.id == contact_id for c in contacts):
                        return True
            return False
        except Exception:
            return False