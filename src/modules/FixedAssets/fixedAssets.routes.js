const express = require("express");
const fixedAssetController = require("./fixedAssets.controller");
const router = express.Router();

router.get("/", fixedAssetController.getAllFixedAssets);
router.get("/:id", fixedAssetController.getFixedAssetById);
router.post("/", fixedAssetController.createFixedAsset);
router.put("/:id", fixedAssetController.updateFixedAsset);
router.delete("/:id", fixedAssetController.deleteFixedAsset);

module.exports = { fixedAssetRoutes: router };
