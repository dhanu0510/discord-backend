const authSocket = require("./middleware/authSocket");
const { addNewConnectedUser } = require("./serverStore");
const newConnectionHandler = require("./socketHandler/newConnectionHandler");
const disconnectHandler = require("./socketHandler/disconnectHandler");
const directMessageHandler = require("./socketHandler/directMessageHandler");
const directChatHistoryHandler = require("./socketHandler/directChatHistoryHandler");

const serverStore = require("./serverStore");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  serverStore.setSocketServerInstance(io);

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    newConnectionHandler(socket, io);
    emitOnlineUsers();
    //   new connection handler

    socket.on("direct-message", (data) => {
      console.log(data);
      directMessageHandler(socket, data);
    });
    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data);
    });

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });
  setInterval(() => {
    emitOnlineUsers();
  }, [1000 * 80]);
};

module.exports = { registerSocketServer };
