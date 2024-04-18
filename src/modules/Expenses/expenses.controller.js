const { connection } = require("../../config");

const createExpense = async (req, res) => {
  const {
    select_date,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    ledger,
  } = req.body;
  console.log({
    select_date,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    ledger,
  });

  const sql =
    "INSERT INTO expense (select_date, payment_type, actual_amount, paid_amount, due_amount, note, ledger) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    select_date,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    JSON.stringify(ledger),
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating expense: " + err.message);
      res.status(500).json({ error: "Error creating expense" });
      return;
    }
    res.status(201).json({
      message: "Expense created successfully",
      expenseId: result.insertId,
    });
  });
};
const getAllExpenses = async (req, res) => {
  const sql = "SELECT * FROM expense";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting expenses: " + err.message);
      res.status(500).json({ error: "Error getting expenses" });
      return;
    }

    results.forEach((result) => {
      result.ledger = JSON.parse(result.ledger);
    });
    res.status(200).json(results);
  });
};

const getExpenseById = async (req, res) => {
  const expenseId = req.params.id;
  const sql = "SELECT * FROM expense WHERE id = ?";
  connection.query(sql, [expenseId], (err, result) => {
    if (err) {
      console.error("Error getting expense: " + err.message);
      res.status(500).json({ error: "Error getting expense" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  const sql = "DELETE FROM expense WHERE id = ?";
  connection.query(sql, [expenseId], (err, result) => {
    if (err) {
      console.error("Error deleting expense: " + err.message);
      res.status(500).json({ error: "Error deleting expense" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  });
};

const updateExpense = async (req, res) => {
  const expenseId = req.params.id;
  const {
    select_date,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    ledger,
  } = req.body;
  const sql =
    "UPDATE expense SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, ledger = ? WHERE id = ?";
  connection.query(
    sql,
    [
      select_date,
      payment_type,
      actual_amount,
      paid_amount,
      due_amount,
      note,
      JSON.stringify(ledger),
      expenseId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating expense: " + err.message);
        res.status(500).json({ error: "Error updating expense" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Expense not found" });
        return;
      }
      res.status(200).json({ message: "Expense updated successfully" });
    }
  );
};

const expenseController = {
  getAllExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  updateExpense,
};
module.exports = expenseController;
