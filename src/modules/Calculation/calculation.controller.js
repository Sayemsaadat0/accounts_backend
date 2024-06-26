const { connection } = require("../../config");

const useCalculate = require("../../hook/useCalculate");

const getTotalBankAmount = async (req, res) => {
  useCalculate("accounts", "balance", (err, totalBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({ totalBalance });
  });
};
const getTotalExpenseAmount = async (req, res) => {
  useCalculate("expense", "actual_amount", (err, totalBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    console.log("Sales data", { totalBalance });
    res.status(200).json({ totalBalance });
  });
};
const getTotalIncomeAmount = async (req, res) => {
  useCalculate("incomes", "actual_amount", (err, totalBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({ totalBalance });
  });
};
const getTotalSalesAmount = async (req, res) => {
  useCalculate("sales", "actual_amount", (err, totalBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.status(200).json({ totalBalance });
  });
};
const getTotalPurchaseAmount = async (req, res) => {
  useCalculate("purchase", "actual_amount", (err, totalBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({ totalBalance });
  });
};
const getTotalAccountsPayableAmount = async (req, res) => {
  useCalculate("accounts_payable", "actual_amount", (err, totalBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({ totalBalance });
  });
};
const getTotalAccountsReceivableAmount = async (req, res) => {
  useCalculate("accounts_receivable", "actual_amount", (err, totalBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({ totalBalance });
  });
};
const getTotalFixedAssetsAmount = async (req, res) => {
  useCalculate("fixed_assets", "actual_amount", (err, totalBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json({ totalBalance });
  });
};

const getTotalBalance = async (req, res) => {
  let totalBalance = 0;

  // Get total accounts balance
  useCalculate("accounts", "balance", (err, accountsBalance) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    totalBalance += accountsBalance.totalBalance;

    // Get total sales amount
    useCalculate("cash", "amount", (err, salesAmount) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      totalBalance += salesAmount.totalBalance;

      // Get total accounts payable amount
      res.status(200).json({ totalBalance });
    });
  });
};

module.exports = {
  getTotalBalance,
  getTotalBankAmount,
  getTotalSalesAmount,
  getTotalIncomeAmount,
  getTotalExpenseAmount,
  getTotalPurchaseAmount,
  getTotalFixedAssetsAmount,
  getTotalAccountsPayableAmount,
  getTotalAccountsReceivableAmount,
};
