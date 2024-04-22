const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");

const getAllCashRecords = async (req, res) => {
  const sql = "SELECT * FROM cash";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting cash records: " + err.message);
      res.status(500).json({ error: "Error getting cash records" });
      return;
    }
    res.status(200).json(results);
  });
};

const createCashRecord = async (req, res) => {
  const { amount } = req.body;
  const uniqueId = generateUniqueId();
  const sql = "INSERT INTO cash (id, amount ) VALUES (?, ?)";
  connection.query(sql, [uniqueId, amount], (err, result) => {
    if (err) {
      console.error("Error creating cash record: " + err.message);
      res.status(500).json({ error: "Error creating cash record" });
      return;
    }
    res.status(201).json({
      message: "Cash record created successfully",
      cashId: result.insertId,
    });
  });
};

const getCashById = async (req, res) => {
  const cashId = req.params.id;
  const sql = "SELECT * FROM cash WHERE id = ?";
  connection.query(sql, [cashId], (err, result) => {
    if (err) {
      console.error("Error getting cash data: " + err.message);
      res.status(500).json({ error: "Error getting cash data" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Cash data not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteCash = async (req, res) => {
  const cashId = req.params.id;
  const sql = "DELETE FROM cash WHERE id = ?";
  connection.query(sql, [cashId], (err, result) => {
    if (err) {
      console.error("Error deleting cash data: " + err.message);
      res.status(500).json({ error: "Error deleting cash data" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Cash data not found" });
      return;
    }
    res.status(200).json({ message: "Cash data deleted successfully" });
  });
};

const updateCash = async (req, res) => {
  const cashId = req.params.id;
  const { amount } = req.body;
  const sql = "UPDATE cash SET amount = ? WHERE id = ?";
  connection.query(sql, [amount, cashId], (err, result) => {
    if (err) {
      console.error("Error updating cash data: " + err.message);
      res.status(500).json({ error: "Error updating cash data" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Cash data not found" });
      return;
    }
    res.status(200).json({ message: "Cash data updated successfully" });
  });
};

const cashController = {
  getAllCashRecords,
  createCashRecord,
  updateCash,
  deleteCash,
  getCashById,
};

module.exports = cashController;
