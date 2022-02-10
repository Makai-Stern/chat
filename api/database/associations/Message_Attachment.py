from database import Base
from sqlalchemy import Column, ForeignKey, Integer, Table, Text


Message_Attachment = Table(
    "messages_attachments",
    Base.metadata,
    Column("message_id", Text, ForeignKey("messages.id")),
    Column("attachment_id", Text, ForeignKey("attachments.id")),
)
