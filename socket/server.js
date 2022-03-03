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
    socket.broadcast.emit("getNewUser", user);
  });

  socket.on("joinRooms", (rooms) => {
    rooms.forEach((room) => {
      socket.join(room);
    });
  });

  socket.on("addMessage", (msg) => {
    // send to all users in the chat except the sender
    socket.broadcast.to(msg.chat_id).emit("getMessage", msg);
    // send to all users in the chat
    io.sockets.in(msg.chat_id).emit("getLastMessage", msg);
  });

  socket.on("getAllUsers", () => {
    socket.emit("getAllUsers", users);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    socket.broadcast.emit("removeUser", socket.id);
  });
});
