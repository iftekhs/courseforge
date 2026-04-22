from fastapi import APIRouter

router = APIRouter(prefix="/progress", tags=["progress"])


@router.post("/save")
async def save_progress():
    return {"status": "ok"}


@router.get("/{course_id}")
async def get_progress(course_id: int):
    return {"status": "ok"}