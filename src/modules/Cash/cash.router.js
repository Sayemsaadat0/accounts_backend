const express = require("express");
const cashController = require("./cash.controller");
const router = express.Router();

router.get("/", cashController.getAllCash);
router.post("/", cashController.createCash);
router.put("/:id", cashController.updateCash);
router.delete("/:id", cashController.deleteCash);
router.get("/:id", cashController.getCashById);

module.exports = { cashRoutes: router };
