from datetime import datetime, timedelta

from decouple import config
from fastapi.encoders import jsonable_encoder

import jwt

JWT_SECRET = config("SECRET")
JWT_ALGORITHM = config("ALGORITHM")


def signJWT(user):
    # payload = {"id": user["id"], "expires": time.time() + 600}

    if type(user) is object:
        user = jsonable_encoder(user)

    payload = {
        "id": user["id"],
        "expires": str(datetime.now() + timedelta(days=1)),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    data = {
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
        },
        "token": token,
    }

    return data["token"]


def decodeJWT(token: str):
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        # return decoded_token if decoded_token["expires"] >= time.time() else None
        return (
            decoded_token
            if datetime.fromisoformat(decoded_token["expires"]) >= datetime.now()
            else None
        )
    except:
        return {}
