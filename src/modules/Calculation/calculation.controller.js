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
    totalBalance += accountsBalance;

    // Get total sales amount
    useCalculate("sales", "actual_amount", (err, salesAmount) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      totalBalance += salesAmount;

      // Get total accounts payable amount
      useCalculate(
        "accounts_payable",
        "actual_amount",
        (err, accountsPayableAmount) => {
          if (err) {
            res.status(500).json(err);
            return;
          }
          totalBalance -= accountsPayableAmount;

          // Get total purchases amount
          useCalculate("purchase", "actual_amount", (err, purchaseAmount) => {
            if (err) {
              res.status(500).json(err);
              return;
            }
            totalBalance -= purchaseAmount;

            // Get total expenses amount
            useCalculate("expense", "actual_amount", (err, expenseAmount) => {
              if (err) {
                res.status(500).json(err);
                return;
              }
              totalBalance -= expenseAmount;

              // Get total accounts receivable amount
              useCalculate(
                "accounts_receivable",
                "actual_amount",
                (err, accountsReceivableAmount) => {
                  if (err) {
                    res.status(500).json(err);
                    return;
                  }
                  totalBalance += accountsReceivableAmount;

                  // Get total fixed assets amount
                  useCalculate(
                    "fixed_assets",
                    "actual_amount",
                    (err, fixedAssetsAmount) => {
                      if (err) {
                        res.status(500).json(err);
                        return;
                      }
                      totalBalance += fixedAssetsAmount;

                      // Get total incomes amount
                      useCalculate(
                        "incomes",
                        "actual_amount",
                        (err, incomesAmount) => {
                          if (err) {
                            res.status(500).json(err);
                            return;
                          }
                          totalBalance += incomesAmount;

                          // Send the final total balance as response
                          res.status(200).json({ totalBalance });
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        }
      );
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
