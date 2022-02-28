const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandler/updates/friends");
const User = require("../../models/user");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      return res.status(404).send("Invitation not found");
    }

    const { senderId, receiverId } = invitation;
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];
    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    await FriendInvitation.findByIdAndDelete(id);

    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());

    friendsUpdates.updateFriendsPendignInvitations(senderId);
    return res.status(200).send("Accepted");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
module.exports = postAccept;
