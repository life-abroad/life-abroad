from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
async def home():
    return """
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Life Abroad</title></head>
      <body>
        <h1>It works 🎉</h1>
        <p>FastAPI single-page app running in Docker.</p>
      </body>
    </html>
    """
