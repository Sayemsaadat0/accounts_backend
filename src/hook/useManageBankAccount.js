const useManageBankAccount = ({ id, data, amount, sql, transaction_type }) => {
  const uniqueId = generateUniqueId();

  const formattedDate = new Date(select_date).toISOString().split("T")[0];
  const sql = sql;

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
