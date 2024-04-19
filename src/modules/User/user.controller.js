const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");
const bcrypt = require("bcrypt");

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
  const {
    email,
    password,
    username,
    phone_number,
    image,
    company_name = "personal",
  } = req.body;

  // Generate a salt
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      // Handle error
      return;
    }

    // Hash the password with the generated salt
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        // Handle error
        return;
      }
      // Store the hashed password in the database
      const password = hash;
      console.log({
        uniqueId,
        email,
        password,
        username,
        phone_number,
        image,
        company_name,
      });
      const sql =
        "INSERT INTO users (id, email, password, username, phone_number, image, company_name) VALUES (?,?,?,?,?,?,?)";

      connection.query(
        sql,
        [
          uniqueId,
          email,
          password,
          username,
          phone_number,
          image,
          company_name,
        ],
        (err, result) => {
          if (err) {
            console.error("Error creating user: " + err.message);
            res.status(500).json({ error: "Error creating user" });
            return;
          }
          res.status(201).json({
            message: "User created successfully",
            userId: result.insertId,
          });
        }
      );
    });
  });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Retrieve user from the database using the provided email
  const sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, [email], async (err, rows) => {
    if (err) {
      console.error("Error retrieving user: " + err.message);
      res.status(500).json({ error: "Error retrieving user" });
      return;
    }

    // Check if user with the provided email exists
    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = rows[0];

    // Compare the provided password with the hashed password stored in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords: " + err.message);
        res.status(500).json({ error: "Error comparing passwords" });
        return;
      }

      // If passwords match, login successful
      if (result) {
        res.status(200).json({ message: "Login successful", user });
      } else {
        // If passwords don't match, login failed
        res.status(401).json({ error: "Invalid credentials" });
      }
    });
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
  loginUser,
};
module.exports = userController;
