const { connection } = require("../../config");
const useManageBankAccount = require("../../hook/useManageBankAccount");
const generateUniqueId = require("../../middleware/generateUniqueId");

const createAccountsPayable = async (req, res) => {
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
    "INSERT INTO accounts_payable (id, select_date, payment_type, actual_amount, paid_amount, due_amount, note, ledger, company_name, project_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
    payment_type,
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

const getAllAccountsPayable = async (req, res) => {
  const sql = "SELECT * FROM accounts_payable";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting accounts payable: " + err.message);
      res.status(500).json({ error: "Error getting accounts payable" });
      return;
    }

    results.forEach((result) => {
      result.ledger = JSON.parse(result.ledger);
    });
    res.status(200).json(results);
  });
};

const getAccountsPayableById = async (req, res) => {
  const accountsPayableId = req.params.id;
  const sql = "SELECT * FROM accounts_payable WHERE id = ?";
  connection.query(sql, [accountsPayableId], (err, result) => {
    if (err) {
      console.error("Error getting accounts payable: " + err.message);
      res.status(500).json({ error: "Error getting accounts payable" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Accounts payable not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteAccountsPayable = async (req, res) => {
  const accountsPayableId = req.params.id;
  const sql = "DELETE FROM accounts_payable WHERE id = ?";
  connection.query(sql, [accountsPayableId], (err, result) => {
    if (err) {
      console.error("Error deleting accounts payable: " + err.message);
      res.status(500).json({ error: "Error deleting accounts payable" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Accounts payable not found" });
      return;
    }
    res.status(200).json({ message: "Accounts payable deleted successfully" });
  });
};

const updateAccountsPayable = async (req, res) => {
  const accountsPayableId = req.params.id;
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
    "UPDATE accounts_payable SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, ledger = ?, company_name = ?, project_name = ?,  WHERE id = ?";
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
      accountsPayableId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating accounts payable: " + err.message);
        res.status(500).json({ error: "Error updating accounts payable" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Accounts payable not found" });
        return;
      }
      res
        .status(200)
        .json({ message: "Accounts payable updated successfully" });
    }
  );
};

const accountsPayableController = {
  getAllAccountsPayable,
  createAccountsPayable,
  getAccountsPayableById,
  deleteAccountsPayable,
  updateAccountsPayable,
};
module.exports = accountsPayableController;
