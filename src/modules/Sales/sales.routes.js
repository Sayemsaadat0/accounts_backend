const express = require("express");
const saleController = require("./sales.controller");
const router = express.Router();

router.get("/", saleController.getAllSales);
router.get("/:id", saleController.getSaleById);
router.post("/", saleController.createSale);
router.put("/:id", saleController.updateSale);
router.delete("/:id", saleController.deleteSale);

module.exports = { salesRoutes: router };
