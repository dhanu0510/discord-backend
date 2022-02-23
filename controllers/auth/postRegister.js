const bcrypt = require("bcryptjs");
const User = require("../../models/user.js");

const postRegister = async (req, res) => {
  try {
    const { username, password, mail } = req.body;

    const userExist = await User.exists({ mail: mail.toLowerCase() });

    if (userExist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: encryptedPassword,
      mail: mail.toLowerCase(),
    });

    const token = "JWT token";

    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token: token,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).send("Error registering user, " + err);
  }
};

module.exports = postRegister;
