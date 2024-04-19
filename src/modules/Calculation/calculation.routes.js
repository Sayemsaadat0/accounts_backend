const express = require("express");
const calculationController = require("./calculation.controller");
const router = express.Router();

router.get("/total-bank-amount", calculationController.getTotalBankAmount);
router.get(
  "/total-expense-amount",
  calculationController.getTotalExpenseAmount
);
router.get("/total-sales-amount", calculationController.getTotalSalesAmount);

module.exports = { calculationRoutes: router };
