const express = require("express");
const subLedgerController = require("./subLedgers.controller");
const router = express.Router();

router.get("/", subLedgerController.getAllSubLedgers);
router.get("/:id", subLedgerController.getSubLedgerById);
router.post("/", subLedgerController.createSubLedger);
router.put("/:id", subLedgerController.updateSubLedger);
router.delete("/:id", subLedgerController.deleteSubLedger);

module.exports = { subLedgersRoutes: router };
