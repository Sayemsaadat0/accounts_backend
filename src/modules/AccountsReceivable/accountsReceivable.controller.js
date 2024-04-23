const { connection } = require("../../config");
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

  // Add amount to the selected account balance
  const updateBalanceSql = `UPDATE accounts SET balance = balance + ? WHERE id = ?`;
  const updateBalanceValues = [actual_amount, account_id];

  connection.beginTransaction(function (err) {
    if (err) {
      console.error("Error starting transaction: " + err.message);
      res.status(500).json({ error: "Error creating accounts receivable" });
      return;
    }

    connection.query(sql, values, function (err, result) {
      if (err) {
        return connection.rollback(function () {
          console.error("Error creating accounts receivable: " + err.message);
          res.status(500).json({ error: "Error creating accounts receivable" });
        });
      }

      connection.query(updateBalanceSql, updateBalanceValues, function (err) {
        if (err) {
          return connection.rollback(function () {
            console.error("Error updating account balance: " + err.message);
            res
              .status(500)
              .json({ error: "Error creating accounts receivable" });
          });
        }

        connection.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
              console.error("Error committing transaction: " + err.message);
              res
                .status(500)
                .json({ error: "Error creating accounts receivable" });
            });
          }
          res.status(201).json({
            message: "Accounts receivable created successfully",
            accountsReceivableId: result.insertId,
          });
        });
      });
    });
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
