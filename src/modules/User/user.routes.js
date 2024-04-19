const express = require("express");
const userController = require("../User/user.controller");
const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/login", userController.loginUser);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = { userRoutes: router };
