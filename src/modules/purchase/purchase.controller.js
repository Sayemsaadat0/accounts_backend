const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");

const getAllPurchases = async (req, res) => {
  const sql = "SELECT * FROM purchase";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting purchases: " + err.message);
      res.status(500).json({ error: "Error getting purchases" });
      return;
    }
    res.status(200).json(results);
  });
};

const createPurchase = async (req, res) => {
  const uniqueId = generateUniqueId();
  const {
    select_date,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    supplier_name,
  } = req.body;
  const formattedSelectedDate = new Date(select_date)
    .toISOString()
    .split("T")[0];

  const sql =
    "INSERT INTO purchase (id,select_date, payment_type, actual_amount, paid_amount, due_amount, note, supplier_name) VALUES (?,?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [
      uniqueId,
      formattedSelectedDate,
      payment_type,
      actual_amount,
      paid_amount,
      due_amount,
      note,
      supplier_name,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating purchase: " + err.message);
        res.status(500).json({ error: "Error creating purchase" });
        return;
      }
      res.status(201).json({
        message: "Purchase created successfully",
        purchaseId: result.insertId,
      });
    }
  );
};

const getPurchaseById = async (req, res) => {
  const purchaseId = req.params.id;
  const sql = "SELECT * FROM purchase WHERE id = ?";
  connection.query(sql, [purchaseId], (err, result) => {
    if (err) {
      console.error("Error getting purchase: " + err.message);
      res.status(500).json({ error: "Error getting purchase" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Purchase not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deletePurchase = async (req, res) => {
  const purchaseId = req.params.id;
  const sql = "DELETE FROM purchase WHERE id = ?";
  connection.query(sql, [purchaseId], (err, result) => {
    if (err) {
      console.error("Error deleting purchase: " + err.message);
      res.status(500).json({ error: "Error deleting purchase" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Purchase not found" });
      return;
    }
    res.status(200).json({ message: "Purchase deleted successfully" });
  });
};

const updatePurchase = async (req, res) => {
  const purchaseId = req.params.id;
  const {
    select_date,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    supplier_name,
  } = req.body;
  const sql =
    "UPDATE purchase SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, supplier_name = ? WHERE id = ?";
  connection.query(
    sql,
    [
      select_date,
      payment_type,
      actual_amount,
      paid_amount,
      due_amount,
      note,
      supplier_name,
      purchaseId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating purchase: " + err.message);
        res.status(500).json({ error: "Error updating purchase" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Purchase not found" });
        return;
      }
      res.status(200).json({ message: "Purchase updated successfully" });
    }
  );
};

const purchaseController = {
  getAllPurchases,
  updatePurchase,
  deletePurchase,
  getPurchaseById,
  createPurchase,
};

module.exports = purchaseController;
