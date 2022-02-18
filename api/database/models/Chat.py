import os
import uuid
import shutil

from sqlalchemy import Column, DateTime, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base
from decouple import config
from database.associations import Chat_User
from src.utils import resize_img


DOMAIN = config("DOMAIN")


class Chat(Base):
    __tablename__ = "chats"
    # __table_args__ = (
    #     UniqueConstraint("name", "user_id"),
    # )
    id = Column(
        "id", Text(length=36), default=lambda: str(uuid.uuid4()), primary_key=True
    )
    type = Column(Text)
    name = Column(Text)
    img = Column(String)

    """Relationships"""
    # user relationship
    owner_id = Column(Text, ForeignKey("users.id"))
    owner = relationship("User", back_populates="chats_owned", foreign_keys=owner_id)
    users = relationship("User", secondary=Chat_User, back_populates="chats")
    # message relationship
    messages = relationship("Message", back_populates="chat", cascade="all,delete")
    # invites relationship (not implemented yet)
    invites_sent = relationship("Invite", back_populates="chat")

    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )

    def update_image(self, image):

        if image.filename:
            ext = os.path.splitext(image.filename)[1]
            while True:
                # this is the closest thing to a do-while loop, in python
                filename = uuid.uuid4().hex + ext
                file_location = f"static/{filename}"
                if not os.path.exists(file_location):
                    break
            # Save Image file
            with open(file_location, "wb+") as file_object:
                shutil.copyfileobj(image.file, file_object)

            # Get old image path
            old_image = self.img

            # Add Image Path to Model
            self.img = file_location

            # Resize Image if greater than 50px
            resize_img(file_location, 125)

            # Delete old image
            if old_image is not None:
                try:
                    if os.path.exists(old_image):
                        os.remove(old_image)
                except OSError:
                    pass

    def to_dict(self):
        return dict(
            id=self.id,
            owner=self.owner.to_dict(),
            name=self.name,
            type=self.type,
            backgroundImage=f"{DOMAIN}{self.img}" if self.img else None,
            lastMessage=self.messages[len(self.messages) - 1].to_dict()
            if len(self.messages) > 0
            else None,
            users=[user.to_dict() for user in self.users],
            createdAt=self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            updatedAt=self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        )
