const express = require("express");
const { userRoutes } = require("../modules/User/user.routes");
const { accountsRoutes } = require("../modules/Accounts/accounts.routes");
const { assetsRoutes } = require("../modules/Assets/assets.routes");
const { suppliersRoutes } = require("../modules/Suppliers/suppliers.routes");
const { customerRoutes } = require("../modules/Customers/customer.routes");
const { companiesRoutes } = require("../modules/Companies/companies.routes");
const { projectsRoutes } = require("../modules/Projects/projects.routes");
const { ledgersRoutes } = require("../modules/Ledgers/ledgers.routes");
const { subLedgersRoutes } = require("../modules/SubLedgers/subLedgers.routes");
const { expensesRoutes } = require("../modules/Expenses/expenses.routes");
const { incomeRoutes } = require("../modules/Incomes/Incomes.routes");
const { salesRoutes } = require("../modules/Sales/sales.routes");
const { purchaseRoutes } = require("../modules/purchase/purchase.routes");
const { authRoutes } = require("../modules/Auth/auth.routes");
const {
  accountsPayableRoutes,
} = require("../modules/AccountsPayable/accountsPayable.routes");
const {
  accountsReceivableRoutes,
} = require("../modules/AccountsReceivable/accountsReceivable.routes");
const {
  fixedAssetRoutes,
} = require("../modules/FixedAssets/fixedAssets.routes");
const {
  transactionRoutes,
} = require("../modules/AllTransactionData/allTransactionData.routes");

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/accounts",
    route: accountsRoutes,
  },
  {
    path: "/assets",
    route: assetsRoutes,
  },
  {
    path: "/suppliers",
    route: suppliersRoutes,
  },
  {
    path: "/customers",
    route: customerRoutes,
  },
  {
    path: "/companies",
    route: companiesRoutes,
  },
  {
    path: "/projects",
    route: projectsRoutes,
  },
  {
    path: "/ledgers",
    route: ledgersRoutes,
  },
  {
    path: "/sub-ledgers",
    route: subLedgersRoutes,
  },
  {
    path: "/expenses",
    route: expensesRoutes,
  },
  {
    path: "/incomes",
    route: incomeRoutes,
  },
  {
    path: "/accounts-payable",
    route: accountsPayableRoutes,
  },
  {
    path: "/accounts-receivable",
    route: accountsReceivableRoutes,
  },
  {
    path: "/sales",
    route: salesRoutes,
  },
  {
    path: "/purchase",
    route: purchaseRoutes,
  },
  {
    path: "/fixed-assets",
    route: fixedAssetRoutes,
  },
  {
    path: "/all-transactions",
    route: transactionRoutes,
  },
  {
    path: "/login",
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = router;
