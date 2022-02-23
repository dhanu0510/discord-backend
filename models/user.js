const mongoos = require("mongoose");

const userSchema = new mongoos.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoos.model("User", userSchema);
