const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();
const router = require("./src/routes/index");
const { connection } = require("./src/config");
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(express.json());

var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
  session({
    secret:
      "db0858ae98c6209e72140c75a1c747f6b558a9ccee46ef26d49f420a2fb28502fc66057b49e7a5538e4ca8c1722673f2", // Change this to your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true in production for HTTPS
  })
);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

app.get("/", (req, res) => {
  res.send("Server working");
});
app.use("/api/v1", router);

// Define your routes and middleware here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
