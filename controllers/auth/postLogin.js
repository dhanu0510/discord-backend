const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          userId: user._id,
          mail,
        },
        process.env.TOKEN_KEY,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        userDetails: {
          mail: user.mail,
          username: user.username,
          token: token,
        },
      });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    return res.status(500).send("Internal server error" + err);
  }
};

module.exports = postLogin;
