const authSocket = require("./middleware/authSocket");
const newConnectionHandler = require("./socketHandler/newConnectionHandler");
const disconnectHandler = require("./socketHandler/disconnectHandler");
const directMessageHandler = require("./socketHandler/directMessageHandler");
const directChatHistoryHandler = require("./socketHandler/directChatHistoryHandler");
const roomCreateHandler = require("./socketHandler/roomCreateHandler");

const roomJoinHandler = require("./socketHandler/roomJoinHandler");
const roomLeaveHandler = require("./socketHandler/roomLeaveHandler");

const roomInitializeConnectionHandler = require("./socketHandler/roomInitializeConnectionHandler");
const roomSignalingDataHandler = require("./socketHandler/roomSignalingDataHandler");

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

    socket.on("room-create", () => {
      roomCreateHandler(socket);
    });

    socket.on("room-join", (data) => {
      roomJoinHandler(socket, data);
    });

    socket.on("room-leave", (data) => {
      roomLeaveHandler(socket, data);
    });
    socket.on("conn-init", (data) => {
      roomInitializeConnectionHandler(socket, data);
    });

    socket.on("conn-signal", (data) => {
      roomSignalingDataHandler(socket, data);
    });
    socket.on("conn-signal", (data) => {
      roomSignalingDataHandler(socket, data);
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
