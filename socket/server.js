const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

function addUser(user, sid) {
  !users.some((u) => u.id === user.id) && users.push({ ...user, sid });
}

function removeUser(sid) {
  users = users.filter((user) => user.sid !== sid);
}

io.on("connection", (socket) => {
  socket.on("addUser", (user) => {
    addUser(user, socket.id);
    // socket.broadcast.emit("getNewUser", user);
  });

  socket.on("joinRooms", (rooms) => {
    rooms.forEach((room) => {
      socket.join(room);
    });
  });

  socket.on("sendMessage", (payload) => {
    const { chat, user } = payload;

    let sids = [];
    chat.users.forEach((u) => {
      if (u.id !== user.id) {
        const socketUser = users.find((socketObj) => socketObj.id !== user.id);
        if (socketUser) sids.push(socketUser.sid);
      }
    });

    sids.forEach((sid) => {
      io.to(sid).emit("getChat", payload);
    });

    // send to all users in the chat except the sender
    socket.broadcast.to(chat.id).emit("getMessage", payload);

    // send to all users in the chat
    let updatedPayload = { ...payload };
    updatedPayload.chat.lastMessage =
      payload.messages[payload.messages.length - 1];
    io.sockets.in(chat.id).emit("getLastMessage", updatedPayload);
  });

  socket.on("newChat", (payload) => {
    // DRY: Need to put in a func
    const { chat, user } = payload;

    let sids = [];
    chat.users.forEach((u) => {
      if (u.id !== user.id) {
        const socketUser = users.find((socketObj) => socketObj.id !== user.id);
        if (socketUser) sids.push(socketUser.sid);
      }
    });

    sids.forEach((sid) => {
      io.to(sid).emit("getChat", payload);
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    socket.broadcast.emit("removeUser", socket.id);
  });
});
