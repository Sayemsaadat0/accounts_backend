const { connection } = require("../../config");
const useManageBankAccount = require("../../hook/useManageBankAccount");
const generateUniqueId = require("../../middleware/generateUniqueId");

const createAccountsReceivable = async (req, res) => {
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

  const formattedSelectedDate = new Date(select_date)
    .toISOString()
    .split("T")[0];

  const sql =
    "INSERT INTO accounts_receivable (id, select_date, payment_type, actual_amount, paid_amount, due_amount, note, ledger, company_name, project_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    uniqueId,
    formattedSelectedDate,
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
    payment_type,
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

const getAllAccountsReceivable = async (req, res) => {
  const sql = "SELECT * FROM accounts_receivable";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting accounts receivable: " + err.message);
      res.status(500).json({ error: "Error getting accounts receivable" });
      return;
    }

    results.forEach((result) => {
      result.ledger = JSON.parse(result.ledger);
    });
    res.status(200).json(results);
  });
};

const getAccountsReceivableById = async (req, res) => {
  const accountsReceivableId = req.params.id;
  const sql = "SELECT * FROM accounts_receivable WHERE id = ?";
  connection.query(sql, [accountsReceivableId], (err, result) => {
    if (err) {
      console.error("Error getting accounts receivable: " + err.message);
      res.status(500).json({ error: "Error getting accounts receivable" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Accounts receivable not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteAccountsReceivable = async (req, res) => {
  const accountsReceivableId = req.params.id;
  const sql = "DELETE FROM accounts_receivable WHERE id = ?";
  connection.query(sql, [accountsReceivableId], (err, result) => {
    if (err) {
      console.error("Error deleting accounts receivable: " + err.message);
      res.status(500).json({ error: "Error deleting accounts receivable" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Accounts receivable not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Accounts receivable deleted successfully" });
  });
};

const updateAccountsReceivable = async (req, res) => {
  const accountsReceivableId = req.params.id;
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
    "UPDATE accounts_receivable SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, ledger = ?, company_name = ?, project_name = ?,  WHERE id = ?";
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
      accountsReceivableId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating accounts receivable: " + err.message);
        res.status(500).json({ error: "Error updating accounts receivable" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Accounts receivable not found" });
        return;
      }
      res
        .status(200)
        .json({ message: "Accounts receivable updated successfully" });
    }
  );
};

const accountsReceivableController = {
  getAllAccountsReceivable,
  createAccountsReceivable,
  getAccountsReceivableById,
  deleteAccountsReceivable,
  updateAccountsReceivable,
};
module.exports = accountsReceivableController;
