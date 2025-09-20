import jwt
from datetime import datetime, timedelta, timezone
from src.utils.env import get_env_var

class JwtProvider:
    def __init__(self):
        self.secret_key = get_env_var("JWT_SECRET_KEY")
        self.algorithm = "HS256"
        
    def create_user_view_token(self, user_id: int, expires_days: int = 30) -> str:
        """Create a JWT token for a user to view their accessible posts"""
        payload = {
            "sub": str(user_id),
            "exp": datetime.now(timezone.utc) + timedelta(days=expires_days),
            "type": "view"
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token: str) -> dict | None:
        """Verify a JWT token"""
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except jwt.PyJWTError:
            return None