const { connection } = require("../../config");

const createAccountsReceivable = async (req, res) => {
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
    "INSERT INTO accounts_receivable (select_date, payment_type, actual_amount, paid_amount, due_amount, note, ledger) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
      console.error("Error creating accounts receivable: " + err.message);
      res.status(500).json({ error: "Error creating accounts receivable" });
      return;
    }
    res.status(201).json({
      message: "Accounts receivable created successfully",
      accountsPayableId: result.insertId,
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
    ledger,
  } = req.body;
  const sql =
    "UPDATE accounts_receivable SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, ledger = ? WHERE id = ?";
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
