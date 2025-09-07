from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from src.infrastructure.database import engine
from .posts import router as posts_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(posts_router)

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
