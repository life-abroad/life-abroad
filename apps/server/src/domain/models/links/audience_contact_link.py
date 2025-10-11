from sqlmodel import SQLModel, Field

class AudienceContactLink(SQLModel, table=True):
    audience_id: int = Field(foreign_key="audience.id", primary_key=True)
    contact_id: int = Field(foreign_key="contact.id", primary_key=True)
