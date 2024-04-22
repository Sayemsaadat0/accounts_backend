const express = require("express");
const cashController = require("./cash.controller");
const router = express.Router();

router.get("/", cashController.getAllCashRecords);
router.post("/", cashController.createCashRecord);

router.put("/:id", cashController.updateCashRecord);

module.exports = { cashRoutes: router };
