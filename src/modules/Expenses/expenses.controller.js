const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");

const createExpense = async (req, res) => {
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
  console.log("--------------------", { payment_type });

  const formattedDate = new Date(select_date).toISOString().split("T")[0];
  const sql =
    "INSERT INTO expense (id, select_date, payment_type, actual_amount, paid_amount, due_amount, note, ledger, company_name, project_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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

  // Deduct expense from the selected account balance
  let updateOperator = "-";
  if (
    transaction_type === "income" ||
    transaction_type === "account_Recivable" ||
    transaction_type === "sales"
  ) {
    updateOperator = "+";
  }
  console.log("Update Operator:", updateOperator);

  const updateBalanceSql = `UPDATE accounts SET balance = balance ${updateOperator} ? WHERE id = ?`;
  const updateBalanceValues = [actual_amount, account_id];
  console.log("Update Balance SQL:", updateBalanceSql);
  console.log("Update Balance Values:", updateBalanceValues);

  connection.beginTransaction(function (err) {
    if (err) {
      console.error("Error starting transaction: " + err.message);
      res.status(500).json({ error: "Error creating expense" });
      return;
    }

    connection.query(sql, values, function (err, result) {
      if (err) {
        return connection.rollback(function () {
          console.error("Error creating expense: " + err.message);
          res.status(500).json({ error: "Error creating expense" });
        });
      }

      connection.query(updateBalanceSql, updateBalanceValues, function (err) {
        if (err) {
          return connection.rollback(function () {
            console.error("Error updating account balance: " + err.message);
            res.status(500).json({ error: "Error creating expense" });
          });
        }

        connection.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
              console.error("Error committing transaction: " + err.message);
              res.status(500).json({ error: "Error creating expense" });
            });
          }
          res.status(201).json({
            message: "Expense created successfully",
            expenseId: result.insertId,
          });
        });
      });
    });
  });
};

const getAllExpenses = async (req, res) => {
  const { payment_type, ledger_name, company_name, project_name } = req.query;

  let sql = "SELECT * FROM expense WHERE 1=1";

  if (payment_type) {
    sql += " AND payment_type = ?";
  }
  if (ledger_name) {
    sql += " AND ledger_name = ?";
  }
  if (company_name) {
    sql += " AND company_name = ?";
  }
  if (project_name) {
    sql += " AND project_name = ?";
  }

  connection.query(
    sql,
    [payment_type, ledger_name, company_name, project_name].filter(Boolean),
    (err, results) => {
      if (err) {
        console.error("Error getting expenses: " + err.message);
        return res.status(500).json({ error: "Error getting expenses" });
      }

      results.forEach((result) => {
        result.ledger = JSON.parse(result.ledger);
      });
      res.status(200).json(results);
    }
  );
};

const getExpenseById = async (req, res) => {
  const expenseId = req.params.id;
  const sql = "SELECT * FROM expense WHERE id = ?";
  connection.query(sql, [expenseId], (err, result) => {
    if (err) {
      console.error("Error getting expense: " + err.message);
      return res.status(500).json({ error: "Error getting expense" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    // Assuming ledger column contains JSON data, parse it
    result.forEach((r) => {
      r.ledger = JSON.parse(r.ledger);
    });
    res.status(200).json(result);
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
    ledger_name,
    company_name,
    project_name,
  } = req.body;
  const sql =
    "UPDATE expense SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, ledger = ?, company_name = ?, project_name = ?, WHERE id = ?";
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
