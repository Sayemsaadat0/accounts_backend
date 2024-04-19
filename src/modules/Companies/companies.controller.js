const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");

const getAllCompanies = async (req, res) => {
  const sql = "SELECT * FROM companies";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting companies: " + err.message);
      res.status(500).json({ error: "Error getting companies" });
      return;
    }
    res.status(200).json(results);
  });
};

const createCompany = async (req, res) => {
  const uniqueId = generateUniqueId();
  const { company_code, company_name, company_address } = req.body;
  const sql =
    "INSERT INTO companies (id,company_code, company_name, company_address) VALUES (?,?, ?, ?)";
  connection.query(
    sql,
    [uniqueId, company_code, company_name, company_address],
    (err, result) => {
      if (err) {
        console.error("Error creating company: " + err.message);
        res.status(500).json({ error: "Error creating company" });
        return;
      }
      res.status(201).json({
        message: "Company created successfully",
        companyId: result.insertId,
      });
    }
  );
};

const getCompanyById = async (req, res) => {
  const companyId = req.params.id;
  const sql = "SELECT * FROM companies WHERE id = ?";
  connection.query(sql, [companyId], (err, result) => {
    if (err) {
      console.error("Error getting company: " + err.message);
      res.status(500).json({ error: "Error getting company" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Company not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteCompany = async (req, res) => {
  const companyId = req.params.id;
  const sql = "DELETE FROM companies WHERE id = ?";
  connection.query(sql, [companyId], (err, result) => {
    if (err) {
      console.error("Error deleting company: " + err.message);
      res.status(500).json({ error: "Error deleting company" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Company not found" });
      return;
    }
    res.status(200).json({ message: "Company deleted successfully" });
  });
};

const updateCompany = async (req, res) => {
  const companyId = req.params.id;
  const { company_code, company_name, company_address } = req.body;
  const sql =
    "UPDATE companies SET company_code = ?, company_name = ?, company_address = ? WHERE id = ?";
  connection.query(
    sql,
    [company_code, company_name, company_address, companyId],
    (err, result) => {
      if (err) {
        console.error("Error updating company: " + err.message);
        res.status(500).json({ error: "Error updating company" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Company not found" });
        return;
      }
      res.status(200).json({ message: "Company updated successfully" });
    }
  );
};

const companyController = {
  getAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyById,
  createCompany,
};
module.exports = companyController;
