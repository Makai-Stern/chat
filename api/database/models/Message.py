import uuid

from sqlalchemy import Column, ForeignKey, DateTime, Text, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

# from database.associations import Message_Attachment


class Message(Base):
    __tablename__ = "messages"

    id = Column(
        "id", Text(length=36), default=lambda: str(uuid.uuid4()), primary_key=True
    )
    text = Column(Text)
    type = Column(Text, default="text")

    """Relationships"""
    # user relationship
    chat_id = Column(Text, ForeignKey("chats.id"))
    chat = relationship("Chat", back_populates="messages")
    # user relationship
    user_id = Column(Text, ForeignKey("users.id"))
    user = relationship("User", back_populates="messages")
    # attachment relationship
    attachment_id = Column(Text, ForeignKey("attachments.id"))
    attachment = relationship("Attachment", back_populates="messages")
    # Read by (association object)
    read_by = relationship("Readby", back_populates="message")

    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )

    def to_dict(self):
        return dict(
            id=self.id,
            chatId=self.chat_id,
            type=self.type,
            text=self.text,
            user=self.user.to_dict(),
            readBy=[read_by.to_dict() for read_by in self.read_by],
            attachment=self.attachment.to_dict() if self.attachment else None,
            createdAt=self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            updatedAt=self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            day=self.created_at.strftime("%d %B, %Y"),
            dayWithHour=self.created_at.strftime("%d %B, %Y at %H:%M %p"),
        )
