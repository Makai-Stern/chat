from sqlalchemy import Integer, PrimaryKeyConstraint, DateTime, ForeignKey, Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Chat_User(Base):
    __tablename__ = "chat_user"
    __table_args__ = (
        # this can be db.PrimaryKeyConstraint if you want it to be a primary key
        PrimaryKeyConstraint("user_id", "chat_id"),
    )

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="chats")
    chat_id = Column(Integer, ForeignKey("chats.id"))
    chat = relationship("Chat", back_populates="users")

    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )

    def to_dict(self):
        return dict(
            user=self.user.to_dict(),
            chat=self.chat.to_dict(),
            created_at=self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        )
