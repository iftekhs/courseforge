import subprocess
import threading
import time
from pathlib import Path
import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import get_settings
from app.api_pywebview import CourseAPI, _set_window


def create_api_app() -> FastAPI:
    app = FastAPI(title="CourseForge API", debug=True)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router, prefix="/api")
    return app


def wait_for_vite(vite_dir: Path, timeout: int = 30) -> str:
    """Wait for Vite to start and return the URL."""
    import socket
    import re
    
    # Start Vite in background
    proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=str(vite_dir),
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    # Read output until we get the URL
    start_time = time.time()
    url = "http://127.0.0.1:5173"
    
    for line in proc.stdout:
        print(f"[Vite] {line.rstrip()}")
        
        # Look for the URL in the output
        match = re.search(r'Local:\s*+(https?://[^\s]+)', line)
        if match:
            url = match.group(1)
            break
        
        if time.time() - start_time > timeout:
            break
    
    return url


def main():
    settings = get_settings()
    frontend_dir = Path(__file__).resolve().parent.parent.parent / "frontend"
    
    print("\n=== CourseForge ===")
    print("Waiting for Vite dev server...")
    
    # Wait for Vite to start
    url = wait_for_vite(frontend_dir)
    print(f"Frontend ready at: {url}")
    
    # Start FastAPI backend
    print("Starting Python backend...")
    api_app = create_api_app()
    api_thread = threading.Thread(target=lambda p=8000, a=api_app: uvicorn.run(a, host="127.0.0.1", port=p, log_level="warning"), daemon=True)
    api_thread.start()
    print("Backend ready at: http://127.0.0.1:8000")
    
    # Open the app
    print("Opening CourseForge window...")
    import webview
    
    window = webview.create_window(
        title=settings.app_name,
        url=url,
        width=1200,
        height=800,
        resizable=True,
        js_api=CourseAPI()
    )
    
    # IMPORTANT: Must set window before starting
    _set_window(window)

    webview.start()


if __name__ == "__main__":
    main()