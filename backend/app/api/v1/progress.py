from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
from pathlib import Path
import json
import os

router = APIRouter(prefix="/progress", tags=["progress"])

class LessonState(BaseModel):
    state: Literal["not_started", "in_progress", "completed"]

class ProgressData(BaseModel):
    courseId: str
    lessons: dict[str, str]

def get_progress_file_path(course_id: str) -> Path:
    user_data = os.path.expanduser("~")
    progress_dir = Path(user_data) / ".courseforge"
    progress_dir.mkdir(exist_ok=True)
    return progress_dir / f"{course_id}.json"

@router.get("/{course_id}")
async def get_progress(course_id: str):
    file_path = get_progress_file_path(course_id)
    if not file_path.exists():
        return {"courseId": course_id, "lessons": {}}
    
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
        return data
    except Exception:
        return {"courseId": course_id, "lessons": {}}

@router.post("/{course_id}")
async def save_progress(course_id: str, data: ProgressData):
    file_path = get_progress_file_path(course_id)
    try:
        with open(file_path, "w") as f:
            json.dump(data.model_dump(), f, indent=2)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{course_id}")
async def delete_progress(course_id: str):
    file_path = get_progress_file_path(course_id)
    if file_path.exists():
        file_path.unlink()
    return {"status": "ok"}