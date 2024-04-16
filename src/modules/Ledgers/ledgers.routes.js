const express = require("express");
const ledgerController = require("./ledgers.controller");
const router = express.Router();

router.get("/", ledgerController.getAllLedgers);
router.get("/:id", ledgerController.getLedgerById);
router.post("/", ledgerController.createLedger);
router.put("/:id", ledgerController.updateLedger);
router.delete("/:id", ledgerController.deleteLedger);

module.exports = { ledgersRoutes: router };
