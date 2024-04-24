const { connection } = require("../../config");
const useManageBankAccount = require("../../hook/useManageBankAccount");
const generateUniqueId = require("../../middleware/generateUniqueId");

const createIncome = async (req, res) => {
  const uniqueId = generateUniqueId();
  const {
    select_date,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    ledger_name,
    company_name,
    project_name,
    account_id,
    transaction_type,
  } = req.body;

  // Convert select_date to the correct format
  const formattedDate = new Date(select_date).toISOString().split("T")[0];

  const sql =
    "INSERT INTO incomes (id, select_date, payment_type, actual_amount, paid_amount, due_amount, note, ledger, company_name, project_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)";
  const values = [
    uniqueId,
    formattedDate,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    JSON.stringify(ledger_name),
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

const getAllIncomes = async (req, res) => {
  const sql = "SELECT * FROM incomes";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting incomes: " + err.message);
      res.status(500).json({ error: "Error getting incomes" });
      return;
    }

    results.forEach((result) => {
      result.ledger = JSON.parse(result.ledger);
    });
    res.status(200).json(results);
  });
};

const getIncomeById = async (req, res) => {
  const incomeId = req.params.id;
  const sql = "SELECT * FROM incomes WHERE id = ?";
  connection.query(sql, [incomeId], (err, result) => {
    if (err) {
      console.error("Error getting income: " + err.message);
      res.status(500).json({ error: "Error getting income" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Income not found" });
      return;
    }
    result.forEach((r) => {
      r.ledger = JSON.parse(r.ledger);
    });
    res.status(200).json(result);
  });
};

const deleteIncome = async (req, res) => {
  const incomeId = req.params.id;
  const sql = "DELETE FROM incomes WHERE id = ?";
  connection.query(sql, [incomeId], (err, result) => {
    if (err) {
      console.error("Error deleting income: " + err.message);
      res.status(500).json({ error: "Error deleting income" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Income not found" });
      return;
    }
    res.status(200).json({ message: "Income deleted successfully" });
  });
};

const updateIncome = async (req, res) => {
  const incomeId = req.params.id;
  const {
    select_date,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    ledger_name,
    company_name,
    project_name,
  } = req.body;
  const sql =
    "UPDATE incomes SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, ledger = ?, company_name = ?, project_name = ?,  WHERE id = ?";
  connection.query(
    sql,
    [
      select_date,
      payment_type,
      actual_amount,
      paid_amount,
      due_amount,
      note,
      JSON.stringify(ledger_name),
      company_name,
      project_name,
      incomeId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating income: " + err.message);
        res.status(500).json({ error: "Error updating income" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Income not found" });
        return;
      }
      res.status(200).json({ message: "Income updated successfully" });
    }
  );
};

const incomeController = {
  getAllIncomes,
  createIncome,
  getIncomeById,
  deleteIncome,
  updateIncome,
};
module.exports = incomeController;
