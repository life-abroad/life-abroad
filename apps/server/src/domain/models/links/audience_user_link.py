from sqlmodel import SQLModel, Field

class AudienceUserLink(SQLModel, table=True):
    audience_id: int = Field(foreign_key="audience.id", primary_key=True)
    user_id: int = Field(foreign_key="user.id", primary_key=True)
