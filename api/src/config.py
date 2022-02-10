from decouple import config
from pydantic import BaseSettings

# Routes
from src.routes import (
    auth_router,
    users_router,
    chats_router,
    messages_router
)


def initialize_routes(app):
    app.include_router(auth_router, prefix="/api/auth")
    app.include_router(users_router, prefix="/api/users")
    app.include_router(chats_router, prefix="/api/chats")
    app.include_router(messages_router, prefix="/api/messages")


class Settings(BaseSettings):
    APP_NAME: str = config("APP_NAME")
    DEBUG_MODE: bool = config("DEBUG_MODE")
    HOST: str = config("HOST")
    PORT: int = config("PORT")


settings = Settings()
