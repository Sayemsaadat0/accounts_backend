const express = require("express");
const { userRoutes } = require("../modules/User/user.routes");
const { accountsRoutes } = require("../modules/Accounts/accounts.routes");
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = router;
