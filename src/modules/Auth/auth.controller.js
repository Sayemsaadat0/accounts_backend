const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const uniqueId = generateUniqueId();
  const { username, email, password } = req.body;

  // Check if the email is already registered
  const emailCheckSql = "SELECT * FROM users WHERE email = ?";
  connection.query(emailCheckSql, [email], async (err, rows) => {
    if (err) {
      console.error("Error checking email: " + err.message);
      res.status(500).json({ error: "Error checking email" });
      return;
    }

    if (rows.length > 0) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const company_code = "DEFAULT_VALUE"; // Provide a default value for company_code
    const company_name = "Personal";
    const company_address = "Demo Address";
    const insertUserSql =
      "INSERT INTO users (id, email, password, username, company_code) VALUES (?, ?, ?, ?, ?)";
    connection.query(
      insertUserSql,
      [uniqueId, email, hashedPassword, username, company_code],
      (err, result) => {
        if (err) {
          console.error("Error creating user: " + err.message);
          res.status(500).json({ error: "Error creating user" });
          return;
        }
        // User creation successful
        res.status(201).json({
          message: "User created successfully",
          userId: result.insertId,
        });
      }
    );
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
        // Create a session to indicate user is logged in
        console.log(user);
        // Exclude the password field from the user object before sending it in the response
        const { password, ...userWithoutPassword } = user;
        req.session.userId = userWithoutPassword;
        res
          .status(200)
          .json({ message: "Login successful", user: userWithoutPassword });
      } else {
        // If passwords don't match, login failed
        res.status(401).json({ error: "Invalid credentials" });
      }
    });
  });
};

const updateProfileData = async (req, res) => {
  const userId = req.params.id;
  const { username, image, company_name, email } = req.body;

  // Construct the SQL query dynamically based on the fields provided in the request body
  let sql = "UPDATE users SET";
  const values = [];
  if (username) {
    sql += " username = ?,";
    values.push(username);
  }
  if (image) {
    sql += " image = ?,";
    values.push(image);
  }
  if (company_name) {
    sql += " company_name = ?,";
    values.push(company_name);
  }
  if (email) {
    sql += " email = ?,";
    values.push(email);
  }
  // Remove the trailing comma
  sql = sql.slice(0, -1);
  sql += " WHERE id = ?";
  values.push(userId);

  connection.query(sql, values, (err, result) => {
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

const authController = {
  updateProfileData,
  loginUser,
  createUser,
};
module.exports = authController;
