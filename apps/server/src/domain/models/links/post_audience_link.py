from sqlmodel import SQLModel, Field

class PostAudienceLink(SQLModel, table=True):
    post_id: int = Field(foreign_key="post.id", primary_key=True)
    audience_id: int = Field(foreign_key="audience.id", primary_key=True)
