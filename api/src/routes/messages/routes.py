import os
import uuid
import shutil
from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from database.models.Attachment import Attachment

from database.models import User, Chat, Message
from database.connect import get_db
from src.middlewares import JWTBearer
from src.utils import resize_img


router = APIRouter()


@router.post("/")
def post(
    chat_id: Optional[str] = Form(None),
    current_user: User = Depends(JWTBearer()),
    text: Optional[str] = Form(None),
    attachments: Optional[list[UploadFile]] = File(None),
    db: Session = Depends(get_db),
):
    # check if the chat exists
    db_chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if db_chat is None:
        return JSONResponse(
            content={"error": {"message": "Chat does not exist."}},
            status_code=400,
        )

    # check if use if in chat
    if current_user in db_chat.users:

        if text is None and attachments is None:
            return JSONResponse(
                content={"error": {"message": "You cannot send an empty text message"}},
                status_code=400,
            )

        message = Message(user=current_user, chat=db_chat)

        # check if attachments and text are empty
        if attachments:
            for attachment in attachments:
                if attachment.filename:
                    # save file
                    ext = os.path.splitext(attachment.filename)[1]

                    while True:
                        # this is the closest thing to a do-while loop, in python
                        filename = uuid.uuid4().hex + ext
                        file_location = f"static/{filename}"
                        if not os.path.exists(file_location):
                            break

                    with open(file_location, "wb+") as file_object:
                        shutil.copyfileobj(attachment.file, file_object)

                    if ext in ["jpg", "png", "jpeg"]:
                        # Resize Image if greater than 50px
                        resize_img(file_location, 600)

                    # Add Image Path to Model
                    attachment = Attachment(
                        name=attachment.filename, file=file_location, user=current_user
                    )
                    message.attachments.append(attachment)

        # check if there is text
        if text:
            message.text = text

        db_chat.updated_at = func.now()

        db.add(message)
        db.commit()
        db.refresh(message)

        return message.to_dict()
    else:
        return JSONResponse(
            content={"error": {"message": "You are not authorized to view this chat."}},
            status_code=400,
        )
