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
  const formattedSelectedDate = new Date(select_date)
    .toISOString()
    .split("T")[0];

  const sql =
    "INSERT INTO accounts_payable (id,select_date, payment_type, actual_amount, paid_amount, due_amount, note, ledger) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
  const values = [
    uniqueId,
    formattedSelectedDate,
    payment_type,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    JSON.stringify(ledger),
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating accounts payable: " + err.message);
      res.status(500).json({ error: "Error creating accounts payable" });
      return;
    }
    res.status(201).json({
      message: "Accounts payable created successfully",
      accountsPayableId: result.insertId,
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
    ledger,
  } = req.body;
  const sql =
    "UPDATE accounts_payable SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, ledger = ? WHERE id = ?";
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
