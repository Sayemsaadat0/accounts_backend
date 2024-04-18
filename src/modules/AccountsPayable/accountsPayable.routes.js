const express = require("express");
const accountsPayableController = require("./accountsPayable.controller");
const router = express.Router();

router.get("/", accountsPayableController.getAllAccountsPayable);
router.get("/:id", accountsPayableController.getAccountsPayableById);
router.post("/", accountsPayableController.createAccountsPayable);
router.put("/:id", accountsPayableController.updateAccountsPayable);
router.delete("/:id", accountsPayableController.deleteAccountsPayable);

module.exports = { accountsPayableRoutes: router };
