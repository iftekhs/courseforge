from fastapi import APIRouter
from app.api.v1 import courses, progress, exam

api_router = APIRouter(prefix="/v1")

api_router.include_router(courses.router)
api_router.include_router(progress.router)
api_router.include_router(exam.router)