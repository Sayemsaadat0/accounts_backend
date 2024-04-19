const express = require("express");
const authController = require("./auth.controller");
const router = express.Router();

router.post("/", authController.loginUser);
router.patch("/:id", authController.updateProfileData);

module.exports = { authRoutes: router };
