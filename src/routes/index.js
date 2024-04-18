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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = router;
