import uuid

from sqlalchemy import Column, ForeignKey, DateTime, Text, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base
from database.associations import Message_Attachment


class Message(Base):
    __tablename__ = "messages"

    id = Column("id", Text(length=36), default=lambda: str(uuid.uuid4()), primary_key=True)
    text = Column(Text)

    """Relationships"""
    # user relationship
    chat_id = Column(Text, ForeignKey("chats.id"))
    chat = relationship("Chat", back_populates="messages")
    # user relationship
    user_id = Column(Text, ForeignKey("users.id"))
    user = relationship("User", back_populates="messages")
    # attachment relationship
    attachments = relationship("Attachment", secondary=Message_Attachment, back_populates="messages")
    # Read by (association object)
    read_by = relationship("Readby", back_populates='message')
    
    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    def to_dict(self):
        return dict(
            id=self.id,
            chat_id=self.chat_id,
            text=self.text,
            user=self.user.to_dict(),
            read_by=self.read_by,
            attachments=[attachment.to_dict() for attachment in self.attachments],
            created_at=self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        )
