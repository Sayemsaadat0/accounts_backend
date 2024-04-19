const express = require("express");
const transactionController = require("./allTransactionData.controller");
const router = express.Router();

router.get("/", transactionController.getTransactionAllData);

module.exports = { transactionRoutes: router };
