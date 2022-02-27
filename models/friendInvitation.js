const mongoos = require("mongoose");

const Schema = mongoos.Schema;

const friendInvitationSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoos.model("FriendInvitation", friendInvitationSchema);
