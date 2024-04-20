const express = require("express");
const calculationController = require("./calculation.controller");
const router = express.Router();

router.get("/total-balance", calculationController.getTotalBalance);
router.get("/total-bank-amount", calculationController.getTotalBankAmount);
router.get(
  "/total-expense-amount",
  calculationController.getTotalExpenseAmount
);
router.get("/total-income-amount", calculationController.getTotalIncomeAmount);
router.get("/total-sales-amount", calculationController.getTotalSalesAmount);
router.get(
  "/total-fixed-assets-amount",
  calculationController.getTotalFixedAssetsAmount
);
router.get(
  "/total-accounts-payable-amount",
  calculationController.getTotalAccountsPayableAmount
);
router.get(
  "/total-accounts-receivable-amount",
  calculationController.getTotalAccountsReceivableAmount
);
router.get(
  "/total-purchase-amount",
  calculationController.getTotalPurchaseAmount
);

module.exports = { calculationRoutes: router };
