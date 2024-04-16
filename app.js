const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const router = require("./src/routes/index");
const { connection } = require("./src/config");
app.use(express.json());

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