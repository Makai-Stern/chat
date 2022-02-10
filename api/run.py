import uvicorn

from src import settings


if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )
