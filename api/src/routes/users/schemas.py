from typing import Optional

from pydantic import BaseModel


class UserSchema(BaseModel):
    email: Optional[str] = None
    bio: Optional[str] = None
    name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
