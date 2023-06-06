const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserAddress,
} = require("../controllers/Users.js");
const Login = require("../controllers/Auth.js");
const { authentication, authorization } = require("../middleware/Auth.js");
const userRouter = express.Router();

userRouter.get("/users", authentication, getUsers);
userRouter.get("/users/:id", authentication, getUserById);
userRouter.post("/users", createUser);
userRouter.patch("/users", authentication, authorization, updateUser);
userRouter.delete("/users", authentication, authorization, deleteUser);

userRouter.post("/user/login", Login);

userRouter.patch("/address", authentication, authorization, updateUserAddress);

module.exports = userRouter;
