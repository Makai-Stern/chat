from typing import Optional

from database.connect import get_db
from database.models import User
from fastapi import Cookie, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import session
from src.utils import decodeJWT


class JWTBearer(HTTPBearer):
    
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(
        self,
        token: Optional[str] = Cookie(None),
        db: session = Depends(get_db),
    ):
        if self.auto_error:
            if not token:
                raise HTTPException(status_code=403, detail="Not Authorized.")
            decoded_token = decodeJWT(token)

            if decoded_token:
                user = db.query(User).filter(User.id == decoded_token["id"]).first()
                if user is None:
                    raise HTTPException(status_code=403, detail="Not Authorized.")
                return user
            else:
                raise HTTPException(status_code=403, detail="Not Authorized.")
        else:
            if not token:
                return None
            decoded_token = decodeJWT(token)

            if decoded_token:
                user = db.query(User).filter(User.id == decoded_token["id"]).first()
                if user is None:
                    return None
                return user
            else:
                return None