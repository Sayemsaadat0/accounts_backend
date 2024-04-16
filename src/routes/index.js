const express = require("express");
const { userRoutes } = require("../modules/User/user.routes");
const { accountsRoutes } = require("../modules/Accounts/accounts.routes");
const { assetsRoutes } = require("../modules/Assets/assets.routes");
const { suppliersRoutes } = require("../modules/Suppliers/suppliers.routes");
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = router;
