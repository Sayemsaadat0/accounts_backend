const { connection } = require("../../config");
const useManageBankAccount = require("../../hook/useManageBankAccount");
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
    transaction_type,
    account_id,
    payment_type,
    customer_name,
    paid_amount,
    actual_amount,
    due_amount,
    note,
    company_name,
    project_name,
  } = req.body;

  const formattedSelectedDate = new Date(select_date)
    .toISOString()
    .split("T")[0];
  const sql =
    "INSERT INTO sales (id, select_date, payment_type, customer_name, paid_amount, actual_amount, due_amount, note, company_name, project_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    uniqueId,
    formattedSelectedDate,
    payment_type,
    customer_name,
    paid_amount,
    actual_amount,
    due_amount,
    note,
    company_name,
    project_name,
  ];

  useManageBankAccount({
    transaction_type,
    actual_amount,
    account_id,
    sql,
    values,
    connection, // Pass the 'connection' object
  })
    .then((result) => {
      // Handle the result if needed
      console.log(result);
      res.status(201).json({
        message: "Expense created successfully",
        expenseId: result.expenseId,
      });
    })
    .catch((error) => {
      // Handle error if needed
      console.error(error);
      res.status(500).json({ error: "Error creating expense" });
    });
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
    customer_name,
    paid_amount,
    actual_amount,
    due_amount,
    note,
    company_name,
    project_name,
  } = req.body;
  const sql =
    "UPDATE sales SET select_date = ?, payment_type = ?, customer_name = ?, paid_amount = ?, actual_amount = ?, due_amount = ?, note = ?, company_name = ?, project_name = ?,  WHERE id = ?";
  connection.query(
    sql,
    [
      select_date,
      payment_type,
      customer_name,
      paid_amount,
      actual_amount,
      due_amount,
      note,
      company_name,
      project_name,
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
