const Users = require("../models/Users.js");
const Address = require("../models/Address.js");
const argon2 = require("argon2");

const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["name", "email", "phone_number"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["name", "email", "phone_number"],
      where: {
        id: req.params.id,
      },
    });
    if (!response) return res.status(404).json({ msg: "User Tidak Di Temukan" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createUser = async (req, res) => {
  const name = `${req.body.first_name} ${req.body.last_name}`;
  const { email, password, confPassword, phone_number } = req.body;
  const role = "user";
  if (password !== confPassword) return res.status(400).json({ msg: "Password Dan Confirm Password Tidak Sesuai" });
  const isEmailTaken = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (isEmailTaken) return res.status(400).json({ msg: "Email Ini Sudah Terdaftar" });
  const hashPassword = await argon2.hash(password);

  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      phone_number: phone_number,
      role: role,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }

  const { rt, rw, desa, kecamatan, kabupaten } = req.body;
  const user = await Users.findOne({
    where: {
      email: email,
    },
  });

  try {
    await Address.create({
      userId: user.id,
      rt: rt,
      rw: rw,
      desa: desa,
      kecamatan: kecamatan,
      kabupaten: kabupaten,
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });
  let name = `${req.body.first_name} ${req.body.last_name}`;
  if (req.body.first_name === undefined && req.body.last_name === undefined) {
    name = req.name;
  }
  const { password, confPassword, phone_number } = req.body;

  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword) return res.status(400).json({ msg: "Password Dan Confirm Password Tidak Sesuai" });

  let email = req.body.email;
  if (email === "" || email === null) {
    email = user.email;
  } else {
    const isEmailTaken = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (user.email !== email) {
      if (isEmailTaken) return res.status(400).json({ msg: "Email Ini Sudah Terdaftar" });
    }
  }

  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        phone_number: phone_number,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });
  try {
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateUserAddress = async (req, res) => {
  const { rt, rw, desa, kecamatan, kabupaten } = req.body;
  const addressByUserId = await Address.findOne({
    where: {
      userId: req.userId,
    },
  });
  if (!addressByUserId) return res.status(404).json({ msg: "Address User Tidak Ditemukan" });
  try {
    await Address.update(
      {
        rt: rt,
        rw: rw,
        desa: desa,
        kecamatan: kecamatan,
        kabupaten: kabupaten,
      },
      {
        where: {
          userId: req.userId,
        },
      }
    );
    res.status(200).json({ msg: "Address Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserAddress,
};
