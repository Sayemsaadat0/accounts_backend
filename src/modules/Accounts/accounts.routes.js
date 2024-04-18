const express = require("express");
const accountsController = require("./accounts.controller");
const router = express.Router();

router.get("/", accountsController.getAllAccounts);
router.get("/total-amount", accountsController.getTotalAmount);
router.get("/:id", accountsController.getAccountById);
router.post("/", accountsController.createAccount);
router.put("/:id", accountsController.updateAccount);
router.delete("/:id", accountsController.deleteAccount);

module.exports = { accountsRoutes: router };
