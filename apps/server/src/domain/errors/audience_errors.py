class AudienceNotFoundError(Exception):
    def __init__(self, audience_id: int):
        self.audience_id = audience_id
        super().__init__(f"Audience with id {audience_id} not found")

class UserNotFoundError(Exception):
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"User with id {user_id} not found")
