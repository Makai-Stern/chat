from typing import Optional

from pydantic import BaseModel


class AuthUserSchema(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    name: Optional[str] = None
    password: Optional[str] = None
    newPassword: Optional[str] = None