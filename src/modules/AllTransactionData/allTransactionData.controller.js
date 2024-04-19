const { connection } = require("../../config");

const getTransactionAllData = async (req, res) => {
  try {
    // Execute queries to retrieve the 10 most recently added records from each table
    const latestIncomes = await queryDatabase(
      "SELECT *, 'incomes' as tableName FROM incomes ORDER BY createdAt DESC LIMIT 10"
    );
    const latestExpenses = await queryDatabase(
      "SELECT *, 'expenses' as tableName FROM expense ORDER BY createdAt DESC LIMIT 10"
    );
    const latestPurchases = await queryDatabase(
      "SELECT *, 'purchases' as tableName FROM purchase ORDER BY createdAt DESC LIMIT 10"
    );
    const latestSales = await queryDatabase(
      "SELECT *, 'sales' as tableName FROM sales ORDER BY createdAt DESC LIMIT 10"
    );
    const latestFixedAssets = await queryDatabase(
      "SELECT *, 'fixed_assets' as tableName FROM fixed_assets ORDER BY createdAt DESC LIMIT 10"
    );
    const latestAccountsPayable = await queryDatabase(
      "SELECT *, 'accounts_payable' as tableName FROM accounts_payable ORDER BY createdAt DESC LIMIT 10"
    );
    const latestAccountsReceivable = await queryDatabase(
      "SELECT *, 'accounts_receivable' as tableName FROM accounts_receivable ORDER BY createdAt DESC LIMIT 10"
    );

    // Combine all the results into a single array
    let allLatestData = [];
    allLatestData = allLatestData.concat(
      latestIncomes,
      latestExpenses,
      latestPurchases,
      latestSales,
      latestFixedAssets,
      latestAccountsPayable,
      latestAccountsReceivable
    );

    // Sort the combined array based on the createdAt timestamp to find the most recent update
    allLatestData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Return the 10 most recent records along with their respective table names
    res.status(200).json({ latestUpdatedRecords: allLatestData.slice(0, 10) });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Error retrieving data" });
  }
};

// Function to execute SQL queries
const queryDatabase = (sqlQuery) => {
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const transactionController = {
  getTransactionAllData,
};
module.exports = transactionController;
