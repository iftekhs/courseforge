from dataclasses import dataclass, field
from typing import Literal, Optional
import json
import os
import uuid
import webview
from pathlib import Path
from datetime import datetime

from app.models.course import Course, scan_folder, _count_videos


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "courses_data.json"

if not DATA_FILE.exists():
    ALT_FILE = BASE_DIR.parent / "courses_data.json"
    if ALT_FILE.exists():
        DATA_FILE = ALT_FILE

print(f"[API] Data file: {DATA_FILE}")

_window: Optional[any] = None


def _get_full_path(root_path: str, relative_path: str) -> str:
    if not relative_path or relative_path == ".":
        return root_path
    return str(Path(root_path) / relative_path)


def _load_courses() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _save_courses(courses: list[dict]):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(courses, f, indent=2)


def _load_courses() -> list[dict]:
    if not DATA_FILE.exists():
        print("[DATA] File does not exist")
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            print(f"[DATA] Loaded {len(data)} items from file")
            return data if isinstance(data, list) else []
    except Exception as e:
        print(f"[DATA] Error loading: {e}")
        return []


def _get_course_summary(course_dict: dict) -> dict:
    try:
        course_id = course_dict.get("id", "NO-ID")
        course_name = course_dict.get("name", "NO-NAME")
        print(f"[SUMMARY] Processing course: {course_name} ({course_id})")
        
        tree = course_dict.get("tree", {})
        if tree:
            count = 0
            def countVideos(node):
                nonlocal count
                if node.get("type") == "video":
                    count += 1
                for child in node.get("children", []):
                    countVideos(child)
            countVideos(tree)
            lesson_count = count
        else:
            lesson_count = 0
            
        print(f"[SUMMARY] {course_name} has {lesson_count} lessons")
        
        result = {
            "id": course_id,
            "name": course_name,
            "root_path": course_dict.get("root_path", ""),
            "lesson_count": lesson_count
        }
        print(f"[SUMMARY] Result: {result}")
        return result
        
    except Exception as e:
        print(f"[SUMMARY] Error: {e}")
        import traceback
        traceback.print_exc()
        return {"id": "error", "name": "error", "root_path": "", "lesson_count": 0}


class CourseAPI:
    def get_courses(self) -> list[dict]:
        print("[API] get_courses called (sync)")
        try:
            courses = _load_courses()
            result = [_get_course_summary(c) for c in courses]
            print(f"[API] Returning {len(result)} courses")
            return result
        except Exception as e:
            print(f"[API] Error: {e}")
            return []
    
    async def get_courses_async(self) -> list[dict]:
        print("[API] get_courses_async called")
        try:
            courses = _load_courses()
            result = [_get_course_summary(c) for c in courses]
            print(f"[API] Returning {len(result)} courses")
            return result
        except Exception as e:
            print(f"[API] Error: {e}")
            return []

    def add_course(self, folder_path: str = "") -> dict:
        print(f"[API] add_course called with: {folder_path}")
        
        if not folder_path:
            return {"error": "No folder path provided"}
        
        root = Path(folder_path)
        
        if not root.exists() or not root.is_dir():
            return {"error": "Invalid folder"}
        
        print(f"[API] Scanning folder: {folder_path}")
        
        try:
            tree = scan_folder(root)
            lesson_count = _count_videos(tree)
            
            course_data = {
                "id": str(uuid.uuid4()),
                "name": root.name,
                "root_path": str(root),
                "created_at": datetime.now().isoformat(),
                "tree": tree.to_dict()
            }
            
            courses = _load_courses()
            courses.append(course_data)
            _save_courses(courses)
            
            print(f"[API] Course added: {course_data['name']}")
            
            return {
                "id": course_data["id"],
                "name": course_data["name"],
                "root_path": course_data["root_path"],
                "lesson_count": lesson_count
            }
        except Exception as e:
            print(f"[API] Error: {e}")
            import traceback
            traceback.print_exc()
            return {"error": str(e)}

    def open_folder_dialog(self) -> dict:
        global _window
        
        print("[API] open_folder_dialog called")
        
        if not _window:
            return {"error": "No window"}
        
        try:
            result = _window.create_file_dialog(
                dialog_type=webview.FileDialog.FOLDER,
                directory=""
            )
            
            print(f"[API] Dialog result: {result}")
            
            if not result or len(result) == 0:
                return {"error": "No folder selected"}
            
            return {"folder_path": result[0]}
        except Exception as e:
            print(f"[API] Dialog error: {e}")
            return {"error": str(e)}

    def get_course(self, course_id: str) -> dict:
        print(f"[API] get_course called: {course_id}")
        courses = _load_courses()
        for c in courses:
            if c["id"] == course_id:
                return c
        return {"error": "Course not found"}

    def get_video_url(self, path: str) -> str:
        path_obj = Path(path)
        if not path_obj.exists():
            return ""
        abs_path = path_obj.resolve()
        if os.name == "nt":
            return f"file:///{abs_path}".replace("\\", "/")
        return f"file://{abs_path}"

    def open_in_system_player(self, path: str):
        path_obj = Path(path)
        if path_obj.exists():
            os.startfile(str(path_obj))

    def refresh_page(self):
        global _window
        if _window:
            try:
                print("[API] Refreshing page...")
                _window.evaluate_js('window.location.reload()')
            except Exception as e:
                print(f"[API] Error refreshing: {e}")


def _set_window(window: any):
    global _window
    _window = window
    print(f"[API] Window set: {window}")