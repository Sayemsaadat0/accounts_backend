const express = require("express");
const incomeController = require("./incomes.controller");
const router = express.Router();

router.get("/", incomeController.getAllIncomes);
router.get("/:id", incomeController.getIncomeById);
router.post("/", incomeController.createIncome);
router.put("/:id", incomeController.updateIncome);
router.delete("/:id", incomeController.deleteIncome);

module.exports = { incomeRoutes: router };
