const express = require("express");
const { userRoutes } = require("../modules/User/user.routes");
const router = express.Router();

const moduleRoutes = [
  //   {
  //     path: "/",
  //     route: authRoutes,
  //   },
  {
    path: "/users",
    route: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = router;
