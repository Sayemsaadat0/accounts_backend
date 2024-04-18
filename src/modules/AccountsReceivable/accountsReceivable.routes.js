const express = require("express");
const accountsReceivableController = require("./accountsReceivable.controller");
const router = express.Router();

router.get("/", accountsReceivableController.getAllAccountsReceivable);
router.get("/:id", accountsReceivableController.getAccountsReceivableById);
router.post("/", accountsReceivableController.createAccountsReceivable);
router.put("/:id", accountsReceivableController.updateAccountsReceivable);
router.delete("/:id", accountsReceivableController.deleteAccountsReceivable);

module.exports = { accountsReceivableRoutes: router };
