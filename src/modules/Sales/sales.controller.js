const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");

const getAllSales = async (req, res) => {
  const sql = "SELECT * FROM sales";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting sales: " + err.message);
      res.status(500).json({ error: "Error getting sales" });
      return;
    }
    res.status(200).json(results);
  });
};

const createSale = async (req, res) => {
  const uniqueId = generateUniqueId();
  const {
    select_date,
    payment_type,
    customer,
    paid_amount,
    actual_amount,
    due_amount,
    note,
  } = req.body;
  console.log({
    select_date,
    payment_type,
    customer,
    paid_amount,
    actual_amount,
    due_amount,
    note,
  });
  const sql =
    "INSERT INTO sales (id, select_date, payment_type, customer, paid_amount, actual_amount, due_amount, note) VALUES (?,?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [
      uniqueId,
      select_date,
      payment_type,
      customer,
      paid_amount,
      actual_amount,
      due_amount,
      note,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating sale: " + err.message);
        res.status(500).json({ error: "Error creating sale" });
        return;
      }
      res.status(201).json({
        message: "Sale created successfully",
        saleId: result.insertId,
      });
    }
  );
};

const getSaleById = async (req, res) => {
  const saleId = req.params.id;
  const sql = "SELECT * FROM sales WHERE id = ?";
  connection.query(sql, [saleId], (err, result) => {
    if (err) {
      console.error("Error getting sale: " + err.message);
      res.status(500).json({ error: "Error getting sale" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Sale not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteSale = async (req, res) => {
  const saleId = req.params.id;
  const sql = "DELETE FROM sales WHERE id = ?";
  connection.query(sql, [saleId], (err, result) => {
    if (err) {
      console.error("Error deleting sale: " + err.message);
      res.status(500).json({ error: "Error deleting sale" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Sale not found" });
      return;
    }
    res.status(200).json({ message: "Sale deleted successfully" });
  });
};

const updateSale = async (req, res) => {
  const saleId = req.params.id;
  const {
    select_date,
    payment_type,
    customer,
    paid_amount,
    actual_amount,
    due_amount,
    note,
  } = req.body;
  const sql =
    "UPDATE sales SET select_date = ?, payment_type = ?, customer = ?, paid_amount = ?, actual_amount = ?, due_amount = ?, note = ? WHERE id = ?";
  connection.query(
    sql,
    [
      select_date,
      payment_type,
      customer,
      paid_amount,
      actual_amount,
      due_amount,
      note,
      saleId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating sale: " + err.message);
        res.status(500).json({ error: "Error updating sale" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Sale not found" });
        return;
      }
      res.status(200).json({ message: "Sale updated successfully" });
    }
  );
};

const saleController = {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
  getSaleById,
};

module.exports = saleController;