from fastapi import APIRouter, File, FastAPI
from fastapi.responses import FileResponse
from app.api.v1 import courses, progress, exam
import os

api_router = APIRouter(prefix="/v1")

api_router.include_router(courses.router)
api_router.include_router(progress.router)
api_router.include_router(exam.router)


@api_router.get("/video/{full_path:path}")
async def get_video(full_path: str):
    from urllib.parse import unquote
    from pathlib import Path
    
    video_path = Path(unquote(full_path))
    if not video_path.exists():
        return {"error": "File not found"}
    
    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename=video_path.name
    )