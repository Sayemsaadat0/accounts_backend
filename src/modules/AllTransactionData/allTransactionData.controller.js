// const { connection } = require("../../config");

// const getTransactionAllData = async (req, res) => {
//   try {
//     const latestIncomes = await queryDatabase(
//       `SELECT *, 'incomes' as tableName FROM incomes ORDER BY createdAt DESC`
//     );
//     const latestExpenses = await queryDatabase(
//       `SELECT *, 'expenses' as tableName FROM expense ORDER BY createdAt DESC`
//     );
//     const latestPurchases = await queryDatabase(
//       `SELECT *, 'purchases' as tableName FROM purchase ORDER BY createdAt DESC`
//     );
//     const latestSales = await queryDatabase(
//       `SELECT *, 'sales' as tableName FROM sales ORDER BY createdAt DESC`
//     );
//     const latestFixedAssets = await queryDatabase(
//       `SELECT *, 'fixed_assets' as tableName FROM fixed_assets ORDER BY createdAt DESC`
//     );
//     const latestAccountsPayable = await queryDatabase(
//       `SELECT *, 'accounts_payable' as tableName FROM accounts_payable ORDER BY createdAt DESC`
//     );
//     const latestAccountsReceivable = await queryDatabase(
//       `SELECT *, 'accounts_receivable' as tableName FROM accounts_receivable ORDER BY createdAt DESC`
//     );

//     let allLatestData = [];
//     allLatestData = allLatestData.concat(
//       latestIncomes,
//       latestExpenses,
//       latestPurchases,
//       latestSales,
//       latestFixedAssets,
//       latestAccountsPayable,
//       latestAccountsReceivable
//     );

//     allLatestData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     res.status(200).json({ latestUpdatedRecords: allLatestData });
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


const { connection } = require("../../config");

const getTransactionAllData = async (req, res) => {
  try {
    const paymentType = req.query.payment_type || ""; 
    const incomeQuery = `SELECT *, 'incomes' as tableName FROM incomes ${paymentType ? `WHERE payment_type = '${paymentType}'` : ""} ORDER BY createdAt DESC`;
    const expenseQuery = `SELECT *, 'expenses' as tableName FROM expense ${paymentType ? `WHERE payment_type = '${paymentType}'` : ""} ORDER BY createdAt DESC`;
    const purchaseQuery = `SELECT *, 'purchases' as tableName FROM purchase ${paymentType ? `WHERE payment_type = '${paymentType}'` : ""} ORDER BY createdAt DESC`;
    const salesQuery = `SELECT *, 'sales' as tableName FROM sales ${paymentType ? `WHERE payment_type = '${paymentType}'` : ""} ORDER BY createdAt DESC`;
    const fixedAssetsQuery = `SELECT *, 'fixed_assets' as tableName FROM fixed_assets ${paymentType ? `WHERE payment_type = '${paymentType}'` : ""} ORDER BY createdAt DESC`;
    const accountsPayableQuery = `SELECT *, 'accounts_payable' as tableName FROM accounts_payable ${paymentType ? `WHERE payment_type = '${paymentType}'` : ""} ORDER BY createdAt DESC`;
    const accountsReceivableQuery = `SELECT *, 'accounts_receivable' as tableName FROM accounts_receivable ${paymentType ? `WHERE payment_type = '${paymentType}'` : ""} ORDER BY createdAt DESC`;

    // Execute queries
    const latestIncomes = await queryDatabase(incomeQuery);
    const latestExpenses = await queryDatabase(expenseQuery);
    const latestPurchases = await queryDatabase(purchaseQuery);
    const latestSales = await queryDatabase(salesQuery);
    const latestFixedAssets = await queryDatabase(fixedAssetsQuery);
    const latestAccountsPayable = await queryDatabase(accountsPayableQuery);
    const latestAccountsReceivable = await queryDatabase(accountsReceivableQuery);

    // Combine results
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

    // Sort combined results by createdAt
    allLatestData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Send response
    res.status(200).json({ latestUpdatedRecords: allLatestData });
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
