const { connection } = require("../../config");

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
  const { amount, createdAt } = req.body;
  const sql = "INSERT INTO cash (amount, createdAt) VALUES (?, ?)";
  connection.query(sql, [amount, createdAt], (err, result) => {
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

const updateCashRecord = async (req, res) => {
  const cashId = req.params.id;
  const { amount, createdAt } = req.body;
  const sql = "UPDATE cash SET amount = ?, createdAt = ? WHERE id = ?";
  connection.query(sql, [amount, createdAt, cashId], (err, result) => {
    if (err) {
      console.error("Error updating cash record: " + err.message);
      res.status(500).json({ error: "Error updating cash record" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Cash record not found" });
      return;
    }
    res.status(200).json({ message: "Cash record updated successfully" });
  });
};

 const cashController = {
  getAllCashRecords,
  updateCashRecord,
  createCashRecord,
};

module.exports = cashController;
