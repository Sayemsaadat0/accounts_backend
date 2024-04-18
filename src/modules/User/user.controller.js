const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");

const getAllUsers = async (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting users: " + err.message);
      res.status(500).json({ error: "Error getting users" });
      return;
    }
    res.status(200).json(results);
  });
};
const createUser = async (req, res) => {
  const uniqueId = generateUniqueId();
  const { password, email } = req.body;
  // console.log({ password, email });
  const sql = "INSERT INTO users (id,password, email) VALUES (?,?, ?)";
  connection.query(sql, [uniqueId, password, email], (err, result) => {
    if (err) {
      console.error("Error creating user: " + err.message);
      res.status(500).json({ error: "Error creating user" });
      return;
    }
    res
      .status(201)
      .json({ message: "User created successfully", userId: result.insertId });
  });
};
const getUserById = async (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error getting user: " + err.message);
      res.status(500).json({ error: "Error getting user" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user: " + err.message);
      res.status(500).json({ error: "Error deleting user" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { password, email } = req.body;
  const sql = "UPDATE users SET password = ?, email = ? WHERE id = ?";
  connection.query(sql, [password, email, userId], (err, result) => {
    if (err) {
      console.error("Error updating user: " + err.message);
      res.status(500).json({ error: "Error updating user" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User updated successfully" });
  });
};

const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  createUser,
};
module.exports = userController;
