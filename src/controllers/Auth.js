const Users = require("../models/Users.js");
const { createToken } = require("../helpers/jwt.js");
const argon2 = require("argon2");

const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Password Yang Anda Masukan Salah" });
  const payload = {
    id: user.id,
  };
  res.status(200).json({
    access_token: createToken(payload),
  });
};

module.exports = Login;
