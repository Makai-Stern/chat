import os
import uuid
import shutil

from sqlalchemy import Column, DateTime, String, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from decouple import config

from database import Base
from database.associations import Chat_User
from src.utils import resize_img


DOMAIN = config("DOMAIN")


class User(Base):

    __tablename__ = "users"

    id = Column("id", Text(length=36), default=lambda: str(uuid.uuid4()), primary_key=True)
    # User Credentials
    email = Column(String, index=True, unique=True)
    name = Column(String)
    username = Column(String, index=True, unique=True)
    password = Column(String)
    # User Profile
    bio = Column(String)
    profile_img = Column(String)
    background_img = Column(String)
    account_private = Column(Boolean, default=False)

    """Relationships"""
    # invites relationship (not implemented yet)
    invites_sent = relationship("Invite", back_populates="user", primaryjoin="Invite.user_id == User.id", cascade="all,delete")
    invites_received = relationship("Invite", back_populates="invited_user", primaryjoin="Invite.invited_user_id == User.id", cascade="all,delete")
    # messages relationship
    messages = relationship("Message", back_populates="user", lazy="dynamic", cascade="all,delete")
    # readyby relationship
    read_messages = relationship("Readby", back_populates='user')
    # attachments relationship
    attachments = relationship("Attachment", back_populates="user", lazy="dynamic", cascade="all,delete")
    # chats_owneds relationship
    chats_owned = relationship("Chat", back_populates="owner", lazy="dynamic", cascade="all,delete")
    # chats relationship
    chats = relationship("Chat", secondary=Chat_User, back_populates="users")

    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    def update_image(self, type, image):
        """
        This function will update the profile or background image of the user
        type: 'profile' || 'background'
        """

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

            old_image = None

            if type == "profile":
                # Get old image path
                old_image = self.profile_img

                # Add Image Path to Model
                self.profile_img = file_location

                # Resize Image if greater than 50px
                resize_img(file_location, 125)

            if type == "background":
                # Get old image path
                old_image = self.background_img

                # Add Image Path to Model
                self.background_img = file_location

                # Resize Image if greater than 800px
                resize_img(file_location, 800)

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
            username=self.username,
            bio=self.bio,
            profile_img=f"{DOMAIN}{self.profile_img}" if self.profile_img else None,
            # background_img=f"{DOMAIN}{self.background_img}" if self.background_img else None,
            name=self.name,
            email=self.email,
            created_at=self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        )

    class Config:
        orm_mode = True
