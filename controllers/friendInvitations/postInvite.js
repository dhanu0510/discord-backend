const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdate = require("../../socketHandler/updates/friends");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;

  const { userId, mail } = req.user;

  // check if friend that we would like to invite is not user

  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res.status(409).send("Sorry, you can not send request to yourself");
  }

  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });

  if (!targetUser) {
    return res
      .status(404)
      .send(
        `Sorry, user with ${targetMailAddress} mail address does not exist`
      );
  }

  // check if user already has friend request to this user
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });

  if (invitationAlreadyReceived) {
    return res.status(409).send("Invitation has been already sent");
  }

  // check if user which we would like to invite is already friend with us
  const usersAlreadyFriends = targetUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );

  if (usersAlreadyFriends) {
    return res.status(409).send("User is already your friend");
  }

  // create new invitation in database
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // if invitation has been successfully created, update the friends invitation
  friendsUpdate.updateFriendsPendignInvitations(targetUser._id.toString());

  return res.status(201).send("Invitation has been sent");
};

module.exports = postInvite;
