from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from src.infrastructure.database import engine
from .posts import router as posts_router
from .users import router as users_router
from .audiences import router as audiences_router
from .media_items import router as media_items_router

# Import all models to ensure they're included in metadata
from src.domain.models.post import Post
from src.domain.models.user import User
from src.domain.models.audience import Audience
from src.domain.models.media_item import MediaItem
from src.domain.models.links.audience_user_link import AudienceUserLink
from src.domain.models.links.post_audience_link import PostAudienceLink

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(posts_router)
app.include_router(users_router)
app.include_router(audiences_router)
app.include_router(media_items_router)

@app.get("/", response_class=HTMLResponse)
async def home():
    return """
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Life Abroad</title></head>
      <body>
        <h1>It works </h1>
        <p>FastAPI single-page app running in Docker.</p>
      </body>
    </html>
    """
