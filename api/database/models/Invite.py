from sqlalchemy import Column, DateTime, ForeignKey, PrimaryKeyConstraint, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Invite(Base):
    __tablename__ = "invites"
    __table_args__ = (
        # this can be db.PrimaryKeyConstraint if you want it to be a primary key
        PrimaryKeyConstraint("chat_id", "invited_user_id"),
    )
    
    """Relationships"""
    # the created chat
    chat_id = Column(Text, ForeignKey("chats.id"))
    chat = relationship("Chat", back_populates="invites_sent")
    # User who sent the Invite
    user_id = Column(Text, ForeignKey("users.id"))
    user = relationship("User", back_populates="invites_sent", foreign_keys=[user_id])
    # User who got invited
    invited_user_id = Column(Text, ForeignKey("users.id"))
    invited_user = relationship("User", back_populates="invites_received", foreign_keys=[invited_user_id])

    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())