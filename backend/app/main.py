import subprocess
import threading
import time
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.config import get_settings


def create_api_app() -> FastAPI:
    app = FastAPI(title="CourseForge API", debug=True)
    app.include_router(api_router, prefix="/api")
    return app


def start_vite_dev_server():
    """Start Vite dev server in background."""
    frontend_dir = Path(__file__).resolve().parent.parent.parent / "frontend"
    subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=str(frontend_dir),
        shell=True
    )
    time.sleep(3)


def run_server(port: int, app: FastAPI = None, host: str = "127.0.0.1"):
    config = uvicorn.Config(app, host=host, port=port, log_level="warning")
    server = uvicorn.Server(config)
    server.run()


def main():
    settings = get_settings()

    start_vite_dev_server()

    api_app = create_api_app()

    api_thread = threading.Thread(target=lambda p=8000, a=api_app: run_server(p, a), daemon=True)
    api_thread.start()

    import webview

    window = webview.create_window(
        title=settings.app_name,
        url="http://127.0.0.1:5173",
        width=1200,
        height=800,
        resizable=True
    )

    webview.start()


if __name__ == "__main__":
    main()