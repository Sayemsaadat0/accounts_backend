const express = require("express");
const authController = require("./auth.controller");
const router = express.Router();

router.post("/", authController.loginUser);
router.post("/create-user", authController.createUser);
router.patch("/:id", authController.updateProfileData);

module.exports = { authRoutes: router };
