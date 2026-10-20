from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import api_router
from app.core.config import settings
from app.repositories.complaint_repository import complaint_repository


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.mongodb_url:
        await complaint_repository.connect()
    else:
        print("SmartCityAI is running in in-memory demo mode; set MONGODB_URL to enable MongoDB.")
    try:
        yield
    finally:
        complaint_repository.close()


app = FastAPI(
    title=settings.app_name,
    description="AI-assisted civic complaint intake, triage, routing and resolution.",
    version="1.0.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.api_prefix)
upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")


@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy", "service": settings.app_name}
