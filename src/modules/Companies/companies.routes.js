const express = require("express");
const companyController = require("./companies.controller");
const router = express.Router();

router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);
router.post("/", companyController.createCompany);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

module.exports = { companiesRoutes: router };
