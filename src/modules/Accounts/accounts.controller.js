const { connection } = require("../../config");

const getAllAccounts = async (req, res) => {
  const sql = "SELECT * FROM accounts";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting accounts: " + err.message);
      res.status(500).json({ error: "Error getting accounts" });
      return;
    }
    res.status(200).json(results);
  });
};

const createAccount = async (req, res) => {
  const { account_name, bank_name, account_no, branch_name, balance } =
    req.body;
  const sql =
    "INSERT INTO accounts (account_name, bank_name, account_no, branch_name, balance) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [account_name, bank_name, account_no, branch_name, balance],
    (err, result) => {
      if (err) {
        console.error("Error creating account: " + err.message);
        res.status(500).json({ error: "Error creating account" });
        return;
      }
      res.status(201).json({
        message: "Account created successfully",
        userId: result.insertId,
      });
    }
  );
};

const getAccountById = async (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM accounts WHERE id = ?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error getting account: " + err.message);
      res.status(500).json({ error: "Error getting account" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteAccount = async (req, res) => {
  const accountId = req.params.id;
  const sql = "DELETE FROM accounts WHERE id = ?";
  connection.query(sql, [accountId], (err, result) => {
    if (err) {
      console.error("Error deleting account: " + err.message);
      res.status(500).json({ error: "Error deleting account" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    res.status(200).json({ message: "Account deleted successfully" });
  });
};

const updateAccount = async (req, res) => {
  const accountId = req.params.id;
  const { account_name, bank_name, account_no, branch_name, balance } =
    req.body;
  const sql =
    "UPDATE accounts SET account_name = ?, bank_name = ?, account_no = ?, branch_name = ?, balance = ? WHERE id = ?";
  connection.query(
    sql,
    [account_name, bank_name, account_no, branch_name, balance, accountId],
    (err, result) => {
      if (err) {
        console.error("Error updating account: " + err.message);
        res.status(500).json({ error: "Error updating account" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Account not found" });
        return;
      }
      res.status(200).json({ message: "Account updated successfully" });
    }
  );
};

const accountsController = {
  getAllAccounts,
  updateAccount,
  deleteAccount,
  getAccountById,
  createAccount,
};

module.exports = accountsController;
