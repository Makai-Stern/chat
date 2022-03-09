from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.models import User, Chat, Message, Attachment
from database.associations import Chat_User
from database.connect import get_db
from src.middlewares import JWTBearer


router = APIRouter()


@router.get("/find/{query}")
def find(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
    page: int = None,
    limit: int = 15,
):
    user_id = [current_user.id]

    if query:
        query = query.strip('"')

    query = "%{0}%".format(query)

    if not query or str(query).isspace():
        return []

    db_chats = (
        db.query(Chat, User, Chat_User)
        .group_by(Chat.id)
        .filter((Chat_User.c.user_id.in_(user_id)) & (User.name.ilike(query)))
        .all()
    )

    return [record.User.to_dict() for record in db_chats] if db_chats else []


@router.get("/")
def get(
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
    page: int = None,
    limit: int = 15,
) -> list[Chat] or list:

    # get all chats user is in
    user_id = [current_user.id]

    db_chats = []
    if type(page) is int:
        # paginate chats user is in (page should start at 0)
        skip = (page - 1) * limit
        db_chats = (
            db.query(Chat)
            .join(Chat_User)
            .group_by(Chat.id)
            .filter(Chat_User.c.user_id.in_(user_id))
            .order_by(Chat.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    else:
        # Get all chats user is in
        db_chats = (
            db.query(Chat)
            .join(Chat_User)
            .group_by(Chat.id)
            .filter(Chat_User.c.user_id.in_(user_id))
            .order_by(Chat.updated_at.desc())
            .all()
        )
    chats = [chat.to_dict() for chat in db_chats]
    return chats


@router.get("/count")
def get_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
):
    # get all chats user is in
    user_id = [current_user.id]
    db_chats = (
        db.query(Chat)
        .join(Chat_User)
        .group_by(Chat.id)
        .filter(Chat_User.c.user_id.in_(user_id))
        .all()
    )

    return len(db_chats)


@router.post("/")
def post(
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
    users: Optional[str] = Form(None),
    name: Optional[str] = Form(None),
    backgroundImage: Optional[UploadFile] = File(None),
) -> dict or JSONResponse:

    if users is None:
        return JSONResponse(
            content={
                "error": {
                    "message": "You cannot create a chat without users.",
                }
            },
            status_code=400,
        )

    # temp for postman
    if type(users) is str:
        users = users.strip("[]").split(",")

    try:
        len(users)
    except:
        users = users.strip("[]").split("")

    # This is for postman
    if len(users) == 0:
        # return error if chat.users is empty
        return JSONResponse(
            content={
                "error": {
                    "message": "You cannot create a chat without users.",
                }
            },
            status_code=400,
        )

    # check if chat.users has the current user's id
    if len(users) == 1:
        if users[0] == current_user.id:
            return JSONResponse(
                content={
                    "error": {
                        "message": "You cannot create a chat with yourself.",
                    }
                },
                status_code=400,
            )

    chat_users = []
    missing_users = []
    # append current_user to users_exists:
    chat_users.append(current_user)

    # loop through chat.users and check if users exists
    for id in users:
        db_user = db.query(User).filter(User.id == id).first()
        # if user exists, append the user to the users_exists list
        chat_users.append(
            db_user
        ) if db_user and db_user not in chat_users else missing_users.append(id)

    # return error with users that do not exist / were deleted
    if len(missing_users) > 0:
        return JSONResponse(
            content={
                "error": {
                    "message": "Users not found in database",
                    "users": missing_users,
                }
            },
            status_code=400,
        )

    # create a list of the user ids so that we can
    users_id = [u.id for u in chat_users]
    users_id.sort()
    # check if the user already has a chat with these users w/ the same chat name -> chat.users
    db_chat_exists = (
        db.query(Chat)
        .join(Chat_User)
        .group_by(Chat.id)
        .having(func.group_concat(Chat_User.c.user_id.distinct()) == ",".join(users_id))
        .order_by(Chat_User.c.user_id.desc())
        .filter(Chat.name == name)
        # .order_by(Chat.updated_at.asc())
        .all()
    )

    # if chat exists
    if db_chat_exists:
        # return error: chat already exists, give the chat another name
        #  "message": "Chat already exists with that name ({name}) and has the same users. Please choose a new chat name.".format(
        #        name=name
        #    ),
        return JSONResponse(
            content={"error": {"message": "Chat already exists"}},
            status_code=400,
        )

    # create chat_obj = Chat(owner=current_user, users=chat.users + current_user)
    chat_obj = Chat(owner=current_user, users=chat_users)

    # check if the chat is a group chat
    if len(chat_users) > 2:
        if name is None:
            return JSONResponse(
                content={"error": {"message": "A name is required for group chats."}},
                status_code=400,
            )

        chat_obj.type = "group"
        chat_obj.name = name

        if backgroundImage:
            chat_obj.update_image(backgroundImage)
    else:
        chat_obj.type = "single"

    # add obj to db
    db.add(chat_obj)
    db.commit()
    db.refresh(chat_obj)

    return chat_obj.to_dict()


@router.get("/{id}")
def get_one(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
) -> list[Chat] or list:
    db_chat = db.query(Chat).filter(Chat.id == id).first()
    if db_chat is None:
        return JSONResponse(
            content={
                "error": {
                    "message": "Chat does not exist.",
                }
            },
            status_code=400,
        )

    if current_user not in db_chat.users:
        return JSONResponse(
            content={
                "error": {
                    "message": "You are not authorized to view this chat.",
                }
            },
            status_code=403,
        )

    return db_chat.to_dict()


@router.get("/{id}/messages")
def get_messages(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
    page: int = None,
    limit: int = 15,
) -> list[Message] or list:

    db_chat = db.query(Chat).filter(Chat.id == id).first()

    if db_chat is None:
        return JSONResponse(
            content={
                "error": {
                    "message": "The chat does not exist.",
                }
            },
            status_code=400,
        )

    if current_user not in db_chat.users:
        return JSONResponse(
            content={
                "error": {
                    "message": "You are not authorized to view this chat.",
                }
            },
            status_code=403,
        )

    if type(page) is int:
        # paginate messages in chat (page should start at 0)
        skip = (page - 1) * limit

        # messages
        db_chat_messages = (
            db.query(Message)
            .filter(Message.chat_id == db_chat.id)
            .order_by(Message.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    else:
        # Get all messages in the chat
        db_chat_messages = (
            db.query(Message)
            .filter(Message.chat_id == db_chat.id)
            .order_by(Message.created_at.desc())
            .all()
        )

    # Group Messages by Date
    """
    [
        {
            "18 February, 2022 at 10:32 AM": [
                {
                    "id": "69f888c6-ec39-4e46-b731-6623dce4a58d",
                    "chat_id": "5bc55133-3315-4441-b29b-533d85053243",
                    ...
    """
    response = []
    data = []
    messages = [message.to_dict() for message in db_chat_messages]

    # for message in messages:
    #     key_exists = False
    #     key = message["day"]

    #     for item in data:
    #         if key in item:
    #             key_exists = True
    #             item[key].append(message)

    #     if not key_exists:
    #         item = {key: [message]}
    #         data.append(item)

    # # update keys to include earliest time (Hr & Minute)
    # for item in data:
    #     for key in item:
    #         new_key = item[key][0]["dayWithHour"]
    #         # item[new_key] = item.pop(key)
    #         new_item = item[key]
    #         response.append({new_key: new_item})

    # response.reverse()
    # return response

    return messages


@router.get("/{id}/attachments")
def get_attachments(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
    page: int = None,
    limit: int = 15,
) -> list[Attachment] or list:

    db_chat = db.query(Chat).filter(Chat.id == id).first()
    if db_chat is None:
        return JSONResponse(
            content={
                "error": {
                    "message": "Chat does not exist.",
                }
            },
            status_code=400,
        )

    if current_user not in db_chat.users:
        return JSONResponse(
            content={
                "error": {
                    "message": "You are not authorized to view this chat.",
                }
            },
            status_code=403,
        )

    if type(page) is int:
        # paginate messages in chat (page should start at 0)
        skip = (page - 1) * limit

        db_chat_attachments = (
            db.query(Attachment)
            .join(Message, Attachment)
            .filter(Message.chat_id == id)
            .filter(Message.chat_id == id)
            .order_by(Attachment.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    else:
        # Get all messages in the chat
        db_chat_attachments = (
            db.query(Attachment)
            .join(Message)
            .filter(Message.chat_id == id, Message.attachment_id == Attachment.id)
            .order_by(Message.created_at.desc())
            .all()
        )

    attachments = []
    for attachment in db_chat_attachments:
        attachments.append(attachment.to_dict())

    return attachments
