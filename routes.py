from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.repositories.complaint_repository import complaint_repository
from app.schemas.complaint import ComplaintCreate, ComplaintRecord
from app.services.complaint_service import complaint_service

api_router = APIRouter()


@api_router.get("/dashboard")
async def dashboard():
    return await complaint_service.get_dashboard()


@api_router.get("/complaints", response_model=list[ComplaintRecord])
async def list_complaints():
    return await complaint_repository.list()


@api_router.post("/complaints", response_model=ComplaintRecord, status_code=status.HTTP_201_CREATED)
async def create_complaint(
    title: str = Form(min_length=5, max_length=100),
    category: str = Form(min_length=2, max_length=40),
    location: str = Form(min_length=2, max_length=120),
    description: str = Form(min_length=8, max_length=500),
    priority: str = Form(default="Medium"),
    photo: UploadFile | None = File(default=None),
):
    try:
        payload = ComplaintCreate(
            title=title,
            category=category,
            location=location,
            description=description,
            priority=priority,
        )
        return await complaint_service.create(payload, photo)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
