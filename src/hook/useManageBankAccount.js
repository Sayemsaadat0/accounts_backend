const useManageBankAccount = (id, amount) => {
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
      id,
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
