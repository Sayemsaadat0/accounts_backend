const { connection } = require("../../config");

const getAllCustomers = async (req, res) => {
  const sql = "SELECT * FROM customers";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting customers: " + err.message);
      res.status(500).json({ error: "Error getting customers" });
      return;
    }
    res.status(200).json(results);
  });
};

const createCustomer = async (req, res) => {
  const { customer_name, phone_no, customer_email, customer_address } =
    req.body;
  console.log({ customer_name, phone_no, customer_email, customer_address });
  const sql =
    "INSERT INTO customers (customer_name, phone_no, customer_email, customer_address) VALUES (?, ?, ?, ?)";
  connection.query(
    sql,
    [customer_name, phone_no, customer_email, customer_address],
    (err, result) => {
      if (err) {
        console.error("Error creating customer: " + err.message);
        res.status(500).json({ error: "Error creating customer" });
        return;
      }
      res.status(201).json({
        message: "Customer created successfully",
        customerId: result.insertId,
      });
    }
  );
};

const getCustomerById = async (req, res) => {
  const customerId = req.params.id;
  const sql = "SELECT * FROM customers WHERE id = ?";
  connection.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error("Error getting customer: " + err.message);
      res.status(500).json({ error: "Error getting customer" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteCustomer = async (req, res) => {
  const customerId = req.params.id;
  const sql = "DELETE FROM customers WHERE id = ?";
  connection.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error("Error deleting customer: " + err.message);
      res.status(500).json({ error: "Error deleting customer" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  });
};

const updateCustomer = async (req, res) => {
  const customerId = req.params.id;
  const { customer_name, phone_no, customer_email, customer_address } =
    req.body;
  const sql =
    "UPDATE customers SET customer_name = ?, phone_no = ?, customer_email = ?, customer_address = ? WHERE id = ?";
  connection.query(
    sql,
    [customer_name, phone_no, customer_email, customer_address, customerId],
    (err, result) => {
      if (err) {
        console.error("Error updating customer: " + err.message);
        res.status(500).json({ error: "Error updating customer" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      res.status(200).json({ message: "Customer updated successfully" });
    }
  );
};

const customerController = {
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  createCustomer,
};

module.exports = customerController;
