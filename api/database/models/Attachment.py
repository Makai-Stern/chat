import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from decouple import config

from database import Base
from database.associations import Message_Attachment


DOMAIN = config("DOMAIN")


class Attachment(Base):
    __tablename__ = "attachments"

    id = Column("id", Text(length=36), default=lambda: str(uuid.uuid4()), primary_key=True)
    file = Column(String)
    name = Column(String)

    """Relationships"""
    user_id = Column(Text, ForeignKey("users.id"))
    user = relationship("User", back_populates="attachments")
    messages = relationship("Message", secondary=Message_Attachment, back_populates="attachments")
   
    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        return dict(
        user=self.user.to_dict(), 
        file=config("DOMAIN") + self.file, 
        name=self.name,
        created_at=self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        updated_at=self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
    )
