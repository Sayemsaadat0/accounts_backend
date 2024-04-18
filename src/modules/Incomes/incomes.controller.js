const { connection } = require("../../config");

const createIncome = async (req, res) => {
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
    "INSERT INTO incomes (select_date, payment_type, actual_amount, paid_amount, due_amount, note, ledger) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
      console.error("Error creating income: " + err.message);
      res.status(500).json({ error: "Error creating income" });
      return;
    }
    res.status(201).json({
      message: "Income created successfully",
      incomeId: result.insertId,
    });
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
    ledger,
  } = req.body;
  const sql =
    "UPDATE incomes SET select_date = ?, payment_type = ?, actual_amount = ?, paid_amount = ?, due_amount = ?, note = ?, ledger = ? WHERE id = ?";
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
