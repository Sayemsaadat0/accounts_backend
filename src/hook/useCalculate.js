const { connection } = require("../config");

const useCalculate = (tableName, columnName, callback) => {
  const sql = `SELECT ${columnName} FROM ${tableName}`; // Include the dynamic column name
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(
        `Error getting ${columnName} from ${tableName}: ` + err.message
      );
      callback({ error: `Error getting ${columnName} from ${tableName}` });
      return;
    }

    // Calculate total account balance using reduce
    const totalBalance = results.reduce((accumulator, account) => {
      return accumulator + parseFloat(account[columnName]); // Access the column dynamically
    }, 0);

    // Call the callback function with the total balance
    callback(null, totalBalance);
  });
};

module.exports = useCalculate;
