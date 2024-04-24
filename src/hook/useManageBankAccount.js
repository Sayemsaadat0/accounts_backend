const useManageBankAccount = ({
  transaction_type,
  actual_amount,
  account_id,
  sql,
  values,
  connection,
}) => {
  return new Promise((resolve, reject) => {
    // Deduct expense from the selected account balance
    let updateOperator = "-";
    if (
      transaction_type === "incomes" ||
      transaction_type === "accounts-recivable" ||
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
        reject("Error starting transaction: " + err.message);
        return;
      }

      connection.query(sql, values, function (err, result) {
        if (err) {
          return connection.rollback(function () {
            console.error("Error creating expense: " + err.message);
            reject("Error creating expense: " + err.message);
          });
        }

        connection.query(updateBalanceSql, updateBalanceValues, function (err) {
          if (err) {
            return connection.rollback(function () {
              console.error("Error updating account balance: " + err.message);
              reject("Error updating account balance: " + err.message);
            });
          }

          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                console.error("Error committing transaction: " + err.message);
                reject("Error committing transaction: " + err.message);
              });
            }
            resolve({
              message: "Expense created successfully",
              expenseId: result.insertId,
            });
          });
        });
      });
    });
  });
};

module.exports = useManageBankAccount;
