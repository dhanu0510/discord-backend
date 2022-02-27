const serverStore = require("../serverStore");
const friendsUpdate = require("../socketHandler/updates/friends");

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;
  // console.log(userDetails);
  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });
  friendsUpdate.updateFriendsPendignInvitations(userDetails.userId);
  friendsUpdate.updateFriends(userDetails.userId);
};
module.exports = newConnectionHandler;
