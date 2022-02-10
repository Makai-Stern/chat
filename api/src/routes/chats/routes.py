import re

from fastapi import APIRouter, Depends, Body
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.models import User, Chat, Message, Attachment
from database.associations import Chat_User, Message_Attachment
from database.connect import get_db
from src.middlewares import JWTBearer
from .schemas import ChatSchema


router = APIRouter()


@router.get("/")
def get(
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
    page: int = None,
    limit: int = 15,
) -> list[Chat] or list:

    # get all chats user is in
    user_id = [current_user.id]

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

    return [chat.to_dict() for chat in db_chats] if db_chats is not None else []


@router.get("/{id}")
def get_one(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
    page: int = None,
    limit: int = 15,
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

    response = db_chat.to_dict()

    url_regex = r"\b((?:https?://)?(?:(?:www\.)?(?:[\da-z\.-]+)\.(?:[a-z]{2,6})|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])))(?::[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])?(?:/[\w\.-]*)*/?)\b"

    if type(page) is int:
        # paginate messages in chat (page should start at 0)
        skip = (page - 1) * limit

        # messages
        db_chat_messages = (
            db.query(Message)
            .filter(Message.chat_id == db_chat.id)
            .order_by(Message.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

        # attachments
        db_chat_attachments = (
            db.query(Message_Attachment, Message, Attachment)
            .join(Message, Attachment)
            .filter(Message.chat_id == id)
            .filter(Message.chat_id == id)
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
            .order_by(Message.created_at.asc())
            .all()
        )

        # attachements
        db_chat_attachments = (
            db.query(Message_Attachment, Message, Attachment)
            .join(Message, Attachment)
            .filter(Message.chat_id == id)
            .filter(Message.chat_id == id)
            .order_by(Message.created_at.desc())
            .all()
        )

    messages = [message.to_dict() for message in db_chat_messages]
    response["messages"] = messages

    urls = []
    for message in db_chat_messages:
        if message.text:
            url_matches = re.findall(url_regex, message.text)
            for url in url_matches:
                urls.append({"link": url, "created_at": message.created_at})
    response["links"] = urls

    attachments = []
    for result in db_chat_attachments:
        attachments.append(result.Attachment.to_dict())
    response["attachments"] = attachments

    return response


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
            db.query(Message_Attachment)
            .join(Message_Attachment, Message, Attachment)
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
            db.query(Message_Attachment, Message, Attachment)
            .join(Message, Attachment)
            .filter(Message.chat_id == id)
            .filter(Message.chat_id == id)
            .order_by(Message.created_at.desc())
            .all()
        )

    attachments = []
    for result in db_chat_attachments:
        print(result.Message)
        # db_attachment = db.query(Attachment).filter(Attachment.id == result.attachment_id).first()
        # attachments.append(db_attachment.to_dict()) if db_attachment else None
        attachments.append(result.Attachment.to_dict())

    return attachments


@router.put("/{id}")
def put(
    id: str,
    current_user: User = Depends(JWTBearer()),
    chat: ChatSchema = Body(...),
    db: Session = Depends(get_db),
) -> list[dict] or JSONResponse:

    # check if chat exists
    db_chat: Chat or None = db.query(Chat).filter(Chat.id == id).first()
    users = [current_user]
    missing_users = []

    if db_chat is None:
        return JSONResponse(
            content={
                "error": {
                    "message": "Chat does not exist.",
                }
            },
            status_code=400,
        )

    # have original chat data so that changes can be identified
    original_chat_data: dict or None = db_chat.to_dict()

    # check if the user is in the chat. Owner can clear chat, but we should always put the owner back in
    if current_user in db_chat.users or current_user == db_chat.owner:
        # for now, all users in the chat can make changes, but they can't remove a users from the chat unless they are the owner
        if current_user == db_chat.owner:
            # update attributes of the chat
            for var, value in vars(db_chat).items():
                # if chat.users is not empty
                if type(chat.users) is list:
                    if str(var) == "users":
                        # get user objects
                        # update chat.users
                        for id in chat.users:
                            db_user = db.query(User).filter(User.id == id).first()
                            # if user exists, append the user to the users list
                            users.append(
                                db_user
                            ) if db_user not in users else missing_users.append(id)

                        # update users chat
                        db_chat.users = users
                else:
                    # Set Attribute
                    setattr(db_chat, var, value) if value or str(
                        value
                    ) == "False" else None
        else:
            for var, value in vars(db_chat).items():
                if chat.users:
                    if len(chat.users) > 0 and str(var) == "users":

                        # owner should always be in users list
                        if db_chat.owner not in users:
                            users.append(db_chat.owner)

                        # get user objects
                        # update chat.users
                        for id in chat.users:
                            db_user = db.query(User).filter(User.id == id).first()
                            # if user exists, append the user to the users list
                            users.append(
                                db_user
                            ) if db_user not in users else missing_users.append(id)

                        # check to see if any users from the original list is not in the new list
                        users_removed = list(set(db_chat.users) - set(users))

                        if users_removed:
                            return JSONResponse(
                                content={
                                    "error": {
                                        "message": "You must be an admin to remove users from the chat. However, you can add users to the chat.",
                                        "users": [u.to_dict() for u in users_removed],
                                    }
                                },
                                status_code=400,
                            )
                        else:
                            # update users chat
                            db_chat.users = users
                else:
                    # Set Attribute
                    setattr(db_chat, var, value) if value or str(
                        value
                    ) == "False" else None

    if len(missing_users) > 0:
        # return error with users that do not exist / were deleted
        return JSONResponse(
            content={
                "error": {
                    "message": "Users not found in database",
                    "users": missing_users,
                }
            },
            status_code=400,
        )

    # determine if commit needs to be performed and return chat
    if (
        users != original_chat_data["users"]
        or db_chat.name != original_chat_data["name"]
    ):
        db.commit()
        db.refresh(db_chat)
        return db_chat.to_dict()

    return JSONResponse(
        content={
            "error": {
                "message": "You've made no make changes to the chat.",
            }
        },
        status_code=400,
    )


@router.post("/")
def post(
    db: Session = Depends(get_db),
    current_user: User = Depends(JWTBearer()),
    chat: ChatSchema = Body(...),
) -> dict or JSONResponse:
    # check if chat.users is list
    if type(chat.users) is list:
        # check if chat.users is empty
        if len(chat.users) == 0:
            # return error if chat.users is empty
            return JSONResponse(
                content={
                    "error": {
                        "message": "Chat already exists with that name and has the same users. Please choose a new name.",
                    }
                },
                status_code=400,
            )

        # check if chat.users has the current user's id
        if len(chat.users) == 1:
            if chat.users[0] == current_user.id:
                return JSONResponse(
                    content={
                        "error": {
                            "message": "You cannot create a chat with yourself.",
                        }
                    },
                    status_code=400,
                )

        users = []
        missing_users = []
        # append current_user to users_exists:
        users.append(current_user)

        # loop through chat.users and check if users exists
        for id in chat.users:
            db_user = db.query(User).filter(User.id == id).first()
            # if user exists, append the user to the users_exists list
            users.append(
                db_user
            ) if db_user and db_user not in users else missing_users.append(id)

        if len(missing_users) > 0:
            # return error with users that do not exist / were deleted
            return JSONResponse(
                content={
                    "error": {
                        "message": "Users not found in database",
                        "users": missing_users,
                    }
                },
                status_code=400,
            )

    """ aggregation 
        
        select chat_id
        from chats_users cu
        group by chat_id
        having group_concat(cu.user_id order by cu.user_id) = '1,2,3'
        
    """

    # create a list of the user ids so that we can
    users_id = [u.id for u in users]
    # check if the user already has a chat with these users w/ the same chat name -> chat.users
    db_chat_exists = (
        db.query(Chat)
        .join(Chat_User)
        .group_by(Chat.id)
        .having(func.group_concat(Chat_User.c.user_id) == ",".join(users_id))
        .order_by(Chat_User.c.user_id)
        .all()
    )
    # if chat exists
    if db_chat_exists:
        # return error: chat already exists, give the chat another name
        return JSONResponse(
            content={
                "error": {
                    "message": "Chat already exists with that name ({name}) and has the same users. Please choose a new name.".format(
                        name=chat.name
                    ),
                }
            },
            status_code=400,
        )

    # create chat_obj = Chat(owner=current_user, users=chat.users + current_user)
    chat_obj = Chat(owner=current_user, users=users)

    # add obj to db
    db.add(chat_obj)
    db.commit()
    db.refresh(chat_obj)

    return chat_obj.to_dict()


@router.delete("/{id}")
def delete(
    id: str, db: Session = Depends(get_db), current_user: User = Depends(JWTBearer())
) -> dict or JSONResponse:

    # check if chat exists
    db_chat = db.query(Chat).filter(Chat.id == id).first()
    if db_chat:
        # check if chat is owned by current user
        if db_chat.owner == current_user:
            db_chat_data = db_chat.to_dict()
            # db.query(Chat).filter(Chat.id == id, Chat.owner == current_user).delete()
            # using the session obj enables cascade delete
            db.delete(db_chat)
            db.commit()
            return db_chat_data
        else:
            return JSONResponse(
                content={"error": "You are not authorized to delete this chat."},
                status_code=403,
            )
    return JSONResponse(
        content={"error": "Chat does not exist."},
        status_code=400,
    )
