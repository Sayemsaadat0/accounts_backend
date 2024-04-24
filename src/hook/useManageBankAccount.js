const updateCash = async (connection, cashId, amount) => {
  return new Promise((resolve, reject) => {
    const selectQuery = "SELECT amount FROM cash WHERE id = ?";
    connection.query(selectQuery, [cashId], (err, rows) => {
      if (err) {
        console.error("Error fetching cash data: " + err.message);
        reject("Error fetching cash data");
        return;
      }

      if (rows.length === 0) {
        reject("Cash data not found");
        return;
      }

      const existingAmount = Number(rows[0].amount);
      const newAmount = existingAmount + Number(amount);

      const updateQuery = "UPDATE cash SET amount = ? WHERE id = ?";
      connection.query(updateQuery, [newAmount, cashId], (err, result) => {
        if (err) {
          console.error("Error updating cash data: " + err.message);
          reject("Error updating cash data");
          return;
        }

        if (result.affectedRows === 0) {
          reject("Cash data not found");
          return;
        }

        resolve(newAmount);
      });
    });
  });
};

const useManageBankAccount = ({
  transaction_type,
  actual_amount,
  account_id,
  sql,
  values,
  payment_type,
  connection,
}) => {
  console.log(values);
  return new Promise((resolve, reject) => {
    // Deduct expense from the selected account balance
    let tableName = payment_type === "bank" ? "accounts" : "cash";
    let updateOperator = "-";
    if (
      transaction_type === "incomes" ||
      transaction_type === "accounts-recivable" ||
      transaction_type === "sales"
    ) {
      updateOperator = "+";
    }
    console.log("Update Operator:", updateOperator);

    const updateBalanceSql = `UPDATE ${tableName} SET ${
      tableName === "accounts" ? "balance" : "amount"
    } = ${
      tableName === "accounts" ? "balance" : "amount"
    } ${updateOperator} ? WHERE id = ?`;

    const updateBalanceValues = [actual_amount, account_id];

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

        if (tableName === "cash") {
          // Update cash table
          updateCash(connection, "1", actual_amount)
            .then((newAmount) => {
              connection.commit(function (err) {
                if (err) {
                  return connection.rollback(function () {
                    console.error(
                      "Error committing transaction: " + err.message
                    );
                    reject("Error committing transaction: " + err.message);
                  });
                }
                resolve({
                  message: "Expense created successfully",
                  expenseId: result.insertId,
                  newAmount: newAmount,
                });
              });
            })
            .catch((error) => {
              return connection.rollback(function () {
                console.error("Error updating cash data: " + error);
                reject("Error updating cash data: " + error);
              });
            });
        } else {
          // Update accounts table
          connection.query(
            updateBalanceSql,
            updateBalanceValues,
            function (err) {
              if (err) {
                return connection.rollback(function () {
                  console.error(
                    "Error updating account balance: " + err.message
                  );
                  reject("Error updating account balance: " + err.message);
                });
              }

              connection.commit(function (err) {
                if (err) {
                  return connection.rollback(function () {
                    console.error(
                      "Error committing transaction: " + err.message
                    );
                    reject("Error committing transaction: " + err.message);
                  });
                }
                resolve({
                  message: "Expense created successfully",
                  expenseId: result.insertId,
                });
              });
            }
          );
        }
      });
    });
  });
};

module.exports = useManageBankAccount;
