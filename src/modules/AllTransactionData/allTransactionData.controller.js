const { connection } = require("../../config");

const getTransactionAllData = async (req, res) => {
  let { limit } = req.query;
  limit = limit ? parseInt(limit) : null;
  try {

    const latestIncomes = await queryDatabase(
      `SELECT *, 'incomes' as tableName FROM incomes ORDER BY createdAt DESC ${limit ? `LIMIT ${limit}` : ''}`
    );
    const latestExpenses = await queryDatabase(
      `SELECT *, 'expenses' as tableName FROM expense ORDER BY createdAt DESC ${limit ? `LIMIT ${limit}` : ''}`
    );
    const latestPurchases = await queryDatabase(
      `SELECT *, 'purchases' as tableName FROM purchase ORDER BY createdAt DESC ${limit ? `LIMIT ${limit}` : ''}`
    );
    const latestSales = await queryDatabase(
      `SELECT *, 'sales' as tableName FROM sales ORDER BY createdAt DESC ${limit ? `LIMIT ${limit}` : ''}`
    );
    const latestFixedAssets = await queryDatabase(
      `SELECT *, 'fixed_assets' as tableName FROM fixed_assets ORDER BY createdAt DESC ${limit ? `LIMIT ${limit}` : ''}`
    );
    const latestAccountsPayable = await queryDatabase(
      `SELECT *, 'accounts_payable' as tableName FROM accounts_payable ORDER BY createdAt DESC ${limit ? `LIMIT ${limit}` : ''}`
    );
    const latestAccountsReceivable = await queryDatabase(
      `SELECT *, 'accounts_receivable' as tableName FROM accounts_receivable ORDER BY createdAt DESC ${limit ? `LIMIT ${limit}` : ''}`
    );

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

    allLatestData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ latestUpdatedRecords: allLatestData.slice(0, 10) });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Error retrieving data" });
  }
};

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



// const { connection } = require("../../config");

// const getTransactionAllData = async (req, res) => {
//   let { limit, orderingBy, table_name } = req.query;
//   limit = limit ? parseInt(limit) : null;
  
//   try {
//     // Define an array of default table names
//     const defaultTables = ['incomes', 'expenses', 'purchase', 'sales', 'fixed_assets', 'accounts_payable', 'accounts_receivable'];
    
//     // If table_name is provided, use it, otherwise, use the default tables
//     const tables = table_name ? [table_name] : defaultTables;
    
//     let allLatestData = [];

//     for (const tableName of tables) {
//       // Generate SQL query with conditional orderingBy
//       const sqlQuery = `SELECT *, '${tableName}' as tableName FROM ${tableName} ${orderingBy ? `ORDER BY ${orderingBy} DESC` : ''} ${limit ? `LIMIT ${limit}` : ''}`;
//       const latestData = await queryDatabase(sqlQuery);
      
//       allLatestData = allLatestData.concat(latestData);
//     }

//     allLatestData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     res.status(200).json({ latestUpdatedRecords: allLatestData.slice(0, 10) });
//   } catch (error) {
//     console.error("Error retrieving data:", error);
//     res.status(500).json({ error: "Error retrieving data" });
//   }
// };

// const queryDatabase = (sqlQuery) => {
//   return new Promise((resolve, reject) => {
//     connection.query(sqlQuery, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// const transactionController = {
//   getTransactionAllData,
// };
// module.exports = transactionController;
