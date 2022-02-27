const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandler/updates/friends");

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.body;

    const invitationExists = await FriendInvitation.exists({
      _id: id,
    });
    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }
    friendsUpdates.updateFriendsPendignInvitations(userId);
    return res.send("Rejected");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
module.exports = postReject;
