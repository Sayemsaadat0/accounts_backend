const { connection } = require("../../config");

const getTransactionAllData = async (req, res) => {
  try {
    // Execute queries to retrieve the most recently updated record from each table
    const latestIncomes = await queryDatabase(
      "SELECT * FROM incomes ORDER BY createdAt DESC LIMIT 10"
    );
    const latestExpenses = await queryDatabase(
      "SELECT * FROM expense ORDER BY createdAt DESC LIMIT 10"
    );
    const latestPurchases = await queryDatabase(
      "SELECT * FROM purchase ORDER BY createdAt DESC LIMIT 10"
    );
    const latestSales = await queryDatabase(
      "SELECT * FROM sales ORDER BY createdAt DESC LIMIT 10"
    );
    const latestFixedAssets = await queryDatabase(
      "SELECT * FROM fixed_assets ORDER BY createdAt DESC LIMIT 10"
    );

    // Combine the results into a single array
    const allLatestData = [
      {
        table: "incomes",
        data: latestIncomes[0],
        createdAt: latestIncomes[0] ? latestIncomes[0].createdAt : null,
      },
      {
        table: "expense",
        data: latestExpenses[0],
        createdAt: latestExpenses[0] ? latestExpenses[0].createdAt : null,
      },
      {
        table: "purchase",
        data: latestPurchases[0],
        createdAt: latestPurchases[0] ? latestPurchases[0].createdAt : null,
      },
      {
        table: "sales",
        data: latestSales[0],
        createdAt: latestSales[0] ? latestSales[0].createdAt : null,
      },
      {
        table: "fixed_assets",
        data: latestFixedAssets[0],
        createdAt: latestFixedAssets[0] ? latestFixedAssets[0].createdAt : null,
      },
    ];

    // Sort the array based on the createdAt timestamp to find the most recent update
    allLatestData.sort((a, b) => b.createdAt - a.createdAt);

    // Return the table with the most recent update
    res.status(200).json({ latestUpdatedTable: allLatestData[0] });
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
