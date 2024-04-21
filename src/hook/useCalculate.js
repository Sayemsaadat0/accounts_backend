const { connection } = require("../config");

const useCalculate = (tableName, columnName, callback) => {
  // let date = "";
  // if (columnName == "accounts") {
  //   date = createdAt;
  // }
  const sql = `SELECT ${columnName}, DATE_FORMAT(createdAt, '%Y-%m') AS monthYear FROM ${tableName}`; // Include the dynamic column name and format the date to include month and year
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

    console.log(totalBalance);
    // Calculate monthly balances
    const monthlyBalances = {};
    results.forEach((account) => {
      const monthYear = account.monthYear;
      if (!monthlyBalances[monthYear]) {
        monthlyBalances[monthYear] = 0;
      }
      monthlyBalances[monthYear] += parseFloat(account[columnName]);
    });
    // console.log(monthlyBalances); ok

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
