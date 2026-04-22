from fastapi import Request, status
from fastapi.responses import JSONResponse


async def course_not_found_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "Course not found"}
    )