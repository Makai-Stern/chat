import bcrypt
import sys
import random
import names
from random_username.generate import generate_username
from essential_generators import DocumentGenerator

from database import Base, engine, SessionLocal
from database.models import User, Chat, Message


Base.metadata.create_all(bind=engine)
db = SessionLocal()


def create_users() -> list[User]:
    password = "123456".encode("utf-8")
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    user1username = generate_username()[0].lower()
    user1 = User(
        username=user1username,
        name=names.get_full_name(),
        email="{username}@email.com".format(username=user1username),
        password=hashed_password,
    )

    user2username = generate_username()[0].lower()
    user2 = User(
        username=user2username,
        name=names.get_full_name(),
        email="{username}@email.com".format(username=user2username),
        password=hashed_password,
    )
    users = [user1, user2]

    db.add_all(users)
    db.commit()

    return users


def create_chat() -> dict:
    users = create_users()

    # create the chat and add users
    chat = Chat(owner=users[0], users=users)

    # Save chat to database and get updated chat object
    db.add(chat)
    db.commit()
    db.refresh(chat)

    # generate random sentence
    gen = DocumentGenerator()

    # create messages for both users
    messages = []
    for i in range(12):
        index = random.randint(0, 1)
        sentence = gen.sentence()
        messages.append(Message(user=users[index], chat=chat, text=sentence))

    db.add_all(messages)
    db.commit()

    return chat.to_dict()


def create_users_multiple(count) -> list[User]:
    password = "123456".encode("utf-8")
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    users = []

    for i in range(count):
        username = generate_username()[0].lower()
        name = names.get_full_name()
        user = User(
            username=username,
            name=name,
            email="{name}@email.com".format(name=name.replace(" ", ".").lower()),
            password=hashed_password,
        )
        users.append(user)

    return users


def create_chat_multiple(count=10) -> dict:
    users = create_users_multiple(count)
    owner = users[0]
    print(owner.username)

    for user in users[1:]:
        current_users = [owner, user]

        # create the chat and add users
        chat = Chat(owner=users[0], users=current_users, type="single")

        # Save chat to database and get updated chat object
        db.add(chat)
        db.commit()
        db.refresh(chat)

        # generate random sentence
        gen = DocumentGenerator()

        # create messages for both users
        messages = []
        for i in range(12):
            index = random.randint(0, 1)
            sentence = gen.sentence()
            messages.append(
                Message(user=current_users[index], chat=chat, text=sentence)
            )

        db.add_all(messages)
        db.commit()


def run():

    # e.g: python seeder 10 Y

    arg = sys.argv[1]
    iter = arg if arg else 1

    arg2 = sys.argv[2]
    option = arg2 if arg2 else None

    if option is None:
        for i in range(iter):
            create_chat()
    else:
        create_chat_multiple()


if __name__ == "__main__":
    run()
