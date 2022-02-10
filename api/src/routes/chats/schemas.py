from typing import Optional

from pydantic import BaseModel


class ChatSchema(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    users: Optional[list] = None
