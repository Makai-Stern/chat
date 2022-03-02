import uuid
from typing import Optional

import bcrypt
from fastapi import APIRouter, Depends, Response, UploadFile, File, Form
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database.connect import get_db
from database.models import User
from src.middlewares import JWTBearer
from .schemas import UserSchema


router = APIRouter()


# Get User by Id
@router.get("/")
def get_all(db: Session = Depends(get_db), current_user: User = Depends(JWTBearer())):
    db_users = db.query(User).filter().all()
    return [user.to_dict() for user in db_users]


# Get User by Id or Username
@router.get("/{id}")
def get_one(
    id: str, db: Session = Depends(get_db), current_user: User = Depends(JWTBearer())
):

    if id:
        id = id.strip('"')

    if not id or str(id).isspace():
        return []

    try:
        uuid.UUID(str(id))
        id_is_uuid = True
    except ValueError:
        id_is_uuid = False

    db_user = None

    if id_is_uuid:
        db_user = db.query(User).filter(User.id == id).first()
    else:
        username = id
        substring = "%{0}%".format(username)
        db_user = (
            db.query(User)
            .filter((User.username.ilike(substring)) | (User.name.ilike(substring)))
            .all()
        )

    if db_user:
        if type(db_user) is list:
            return [user.to_dict() for user in db_user]
        else:
            return db_user.to_dict()

    if not id_is_uuid:
        return []

    return JSONResponse(
        content={"error": "User does not exist."},
        status_code=400,
    )


@router.put("/")
def update(
    username: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    backgroundImage: Optional[UploadFile] = File(None),
    profileImage: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
):
    db_user_data = jsonable_encoder(current_user)
    errors = {}

    # Since we are using Form Data you cannot use 'Body'
    user = UserSchema(
        username=username, bio=bio, name=name, email=email, password=password
    )

    # Update Images
    if backgroundImage:
        current_user.update_image("background", backgroundImage)
    if profileImage:
        current_user.update_image("profile", profileImage)

    # The block below will overwrite attributes based on their name
    for var, value in vars(user).items():
        # if
        if user.email and str(var) == "email":
            # Check if email exists
            email_exists = db.query(User).filter(User.email == user.email).first()
            if email_exists:
                errors["email"] = (
                    "Email is taken."
                    if email_exists.id != current_user.id
                    else "You are currently using this email address."
                )
            else:
                # Set Attribute
                setattr(current_user, var, value) if value or str(
                    value
                ) == "False" else None

        elif user.username and str(var) == "username":
            # Check if username exists
            username_exists = (
                db.query(User).filter(User.username == user.username).first()
            )
            if username_exists:
                errors["username"] = (
                    "Username is taken."
                    if username_exists.id != current_user.id
                    else "You are currently using this username."
                )
            else:
                # Set Attribute
                setattr(current_user, var, value) if value or str(
                    value
                ) == "False" else None

        elif user.password and str(var) == "password":
            current_password = value.encode("utf-8")
            hashed_password = bcrypt.hashpw(current_password, bcrypt.gensalt())
            setattr(current_user, var, hashed_password)

        else:
            setattr(current_user, var, value) if value or str(
                value
            ) == "False" else None

    if errors:
        return JSONResponse(
            content={"error": {**errors}},
            status_code=400,
        )

    commit = False
    # If changes were made:

    if (
        current_user.username != db_user_data["username"]
        or current_user.bio != db_user_data["bio"]
        or current_user.name != db_user_data["name"]
        or current_user.email != db_user_data["email"]
        or current_user.profile_img != db_user_data["profile_img"]
        or current_user.background_img != db_user_data["background_img"]
    ):
        commit = True

    # Update User Password (remember password is hashed_password)
    if not commit and db_user_data["password"]:
        if (
            not bcrypt.hashpw(
                db_user_data["password"].encode("utf-8"), current_user.password
            )
            == current_user.password
        ):
            commit = True

    if commit:
        db.commit()
        db.refresh(current_user)
        return current_user.to_dict()

    return JSONResponse(
        content={"error": "User does not exist."},
        status_code=400,
    )


# Delete User
@router.delete("/")
def delete(
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
):
    db_user_data = current_user.to_dict()
    db.query(User).filter(User.id == current_user.id).delete()
    db.commit()
    response.delete_cookie(key="token")
    return db_user_data
