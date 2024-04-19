const { connection } = require("../../config");

// function
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

const authController = {
  loginUser,
};
module.exports = authController;
