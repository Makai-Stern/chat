from database import Base
from sqlalchemy import Column, ForeignKey, Integer, Table, Text


Chat_User = Table(
    "chats_users",
    Base.metadata,
    Column("chat_id", Text, ForeignKey("chats.id")),
    Column("user_id", Text, ForeignKey("users.id")),
)
