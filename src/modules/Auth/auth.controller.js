const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const uniqueId = generateUniqueId();
  const { username, email, password } = req.body;
  console.log({ username, email, password });

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

        // add a default company when user created
        const createCompany = async (req, res) => {
          const uniqueId = generateUniqueId();
          const company_code = "48AAMSMS";
          const company_name = "Personal";
          const company_address = "Demo Address";
          const sql =
            "INSERT INTO companies (id,company_code, company_name, company_address) VALUES (?,?, ?, ?)";
          connection.query(
            sql,
            [uniqueId, company_code, company_name, company_address],
            (err, result) => {
              if (err) {
                console.error("Error creating company: " + err.message);
                res.status(500).json({ error: "Error creating company" });
                return;
              }
              res.status(201).json({
                message: "Company created successfully",
                companyId: result.insertId,
              });
            }
          );
        };
        createCompany();
      } else {
        // If passwords don't match, login failed
        res.status(401).json({ error: "Invalid credentials" });
      }
    });
  });
};
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   console.log({ email, password });

//   try {
//     const rows = await new Promise((resolve, reject) => {
//       const sql = "SELECT * FROM users WHERE email = ?";
//       connection.query(sql, [email], (err, rows) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(rows);
//         }
//       });
//     });

//     if (rows.length === 0) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     const user = rows[0];
//     const match = await bcrypt.compare(password, user.password);

//     if (match) {
//       res.status(200).json({ message: "Login successful", user });
//     } else {
//       res.status(401).json({ error: "Invalid credentials" });
//     }
//   } catch (err) {
//     console.error("Error retrieving user: " + err.message);
//     res.status(500).json({ error: "Error retrieving user" });
//   }
// };

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
