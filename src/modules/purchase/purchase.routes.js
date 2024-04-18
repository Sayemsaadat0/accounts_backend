const express = require("express");
const purchaseController = require("./purchase.controller");
const router = express.Router();

router.get("/", purchaseController.getAllPurchases);
router.get("/:id", purchaseController.getPurchaseById);
router.post("/", purchaseController.createPurchase);
router.put("/:id", purchaseController.updatePurchase);
router.delete("/:id", purchaseController.deletePurchase);

module.exports = { purchaseRoutes: router };
