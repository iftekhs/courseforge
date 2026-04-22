from fastapi import APIRouter

router = APIRouter(prefix="/exam", tags=["exam"])


@router.post("/generate")
async def generate_exam():
    return {"status": "ok"}


@router.post("/result")
async def save_exam_result():
    return {"status": "ok"}


@router.get("/results/{course_id}")
async def get_exam_results(course_id: int):
    return {"status": "ok"}