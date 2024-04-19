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

module.exports = {
  getTotalBankAmount,
  getTotalExpenseAmount,
  getTotalSalesAmount,
};
