from fastapi import APIRouter

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("")
async def list_courses():
    return {"status": "ok"}


@router.post("/scan")
async def scan_course():
    return {"status": "ok"}


@router.get("/{course_id}")
async def get_course(course_id: int):
    return {"status": "ok"}


@router.delete("/{course_id}")
async def delete_course(course_id: int):
    return {"status": "ok"}


@router.get("/{course_id}/tree")
async def get_course_tree(course_id: int):
    return {"status": "ok"}