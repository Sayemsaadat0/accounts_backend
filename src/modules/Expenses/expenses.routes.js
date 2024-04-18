const express = require("express");
const expenseController = require("./expenses.controller");
const router = express.Router();

router.get("/", expenseController.getAllExpenses);
router.get("/:id", expenseController.getExpenseById);
router.post("/", expenseController.createExpense);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

module.exports = { expensesRoutes: router };
