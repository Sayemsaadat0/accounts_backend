const { connection } = require("../../config");
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

  // Update balance based on payment type
  let updateOperator = "-";
  if (
    transaction_type === "income" ||
    transaction_type === "account_Recivable" ||
    transaction_type === "sales"
  ) {
    updateOperator = "+";
  }

  const updateBalanceSql = `UPDATE accounts SET balance = balance ${updateOperator} ?`;

  connection.beginTransaction(function (err) {
    if (err) {
      console.error("Error starting transaction: " + err.message);
      res.status(500).json({ error: "Error creating accounts payable" });
      return;
    }

    connection.query(sql, values, function (err, result) {
      if (err) {
        return connection.rollback(function () {
          console.error("Error creating accounts payable: " + err.message);
          res.status(500).json({ error: "Error creating accounts payable" });
        });
      }

      connection.query(updateBalanceSql, [actual_amount], function (err) {
        if (err) {
          return connection.rollback(function () {
            console.error("Error updating account balance: " + err.message);
            res.status(500).json({ error: "Error creating accounts payable" });
          });
        }

        connection.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
              console.error("Error committing transaction: " + err.message);
              res
                .status(500)
                .json({ error: "Error creating accounts payable" });
            });
          }
          res.status(201).json({
            message: "Accounts payable created successfully",
            accountsPayableId: result.insertId,
          });
        });
      });
    });
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
