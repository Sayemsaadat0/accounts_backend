const { connection } = require("../config");

/**
 * A utility function to calculate totals and monthly balances from a specified table and column in the database.
 *
 * @param {string} tableName - The name of the table in the database.
 * @param {string} columnName - The name of the column in the table to calculate totals from.
 * @param {function} callback - A callback function to handle the results.
 * @returns {void}
 */
const useCalculate = (tableName, columnName, callback) => {
  // Construct SQL query to retrieve data including the dynamic column name and formatted date
  const sql = `SELECT ${columnName}, DATE_FORMAT(select_date, '%Y-%m') AS monthYear FROM ${tableName}`;
  // Execute the SQL query
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(
        `Error getting ${columnName} from ${tableName}: ` + err.message
      );
      // Invoke the callback function with an error message
      callback({ error: `Error getting ${columnName} from ${tableName}` });
      return;
    }

    // Calculate total account balance using reduce
    const totalBalance = results.reduce((accumulator, account) => {
      return accumulator + parseFloat(account[columnName]); // Access the column dynamically
    }, 0);

    // Calculate monthly balances
    const monthlyBalances = {};
    results.forEach((account) => {
      const monthYear = account.monthYear;
      if (!monthlyBalances[monthYear]) {
        monthlyBalances[monthYear] = 0;
      }
      monthlyBalances[monthYear] += parseFloat(account[columnName]);
    });

    // Convert monthlyBalances object into an array of objects with monthName and monthlyBalance
    const monthlyBalanceData = Object.keys(monthlyBalances).map((monthYear) => {
      const [year, month] = monthYear.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("en-US", {
        month: "long",
      }); // Get month name from month number
      return {
        monthName: monthName,
        monthlyBalance: monthlyBalances[monthYear],
      };
    });

    // Log total balance and monthly balances
    console.log({
      totalBalance: totalBalance,
      monthlyBalances: monthlyBalanceData,
    });

    // Call the callback function with the total balance, monthly balances, and month names
    callback(null, {
      totalBalance: totalBalance,
      monthlyBalances: monthlyBalanceData,
    });
  });
};

module.exports = useCalculate;
