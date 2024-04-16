const { connection } = require("../../config");

const getAllSuppliers = async (req, res) => {
  const sql = "SELECT * FROM suppliers";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting suppliers: " + err.message);
      res.status(500).json({ error: "Error getting suppliers" });
      return;
    }
    res.status(200).json(results);
  });
};

const createSupplier = async (req, res) => {
  const { supplier_name, phone_no, supplier_email, supplier_address } =
    req.body;
  console.log({ supplier_name, phone_no, supplier_email, supplier_address });
  const sql =
    "INSERT INTO suppliers (supplier_name, phone_no, supplier_email, supplier_address) VALUES (?, ?, ?, ?)";
  connection.query(
    sql,
    [supplier_name, phone_no, supplier_email, supplier_address],
    (err, result) => {
      if (err) {
        console.error("Error creating supplier: " + err.message);
        res.status(500).json({ error: "Error creating supplier" });
        return;
      }
      res
        .status(201)
        .json({
          message: "Supplier created successfully",
          supplierId: result.insertId,
        });
    }
  );
};

const getSupplierById = async (req, res) => {
  const supplierId = req.params.id;
  const sql = "SELECT * FROM suppliers WHERE id = ?";
  connection.query(sql, [supplierId], (err, result) => {
    if (err) {
      console.error("Error getting supplier: " + err.message);
      res.status(500).json({ error: "Error getting supplier" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteSupplier = async (req, res) => {
  const supplierId = req.params.id;
  const sql = "DELETE FROM suppliers WHERE id = ?";
  connection.query(sql, [supplierId], (err, result) => {
    if (err) {
      console.error("Error deleting supplier: " + err.message);
      res.status(500).json({ error: "Error deleting supplier" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
    res.status(200).json({ message: "Supplier deleted successfully" });
  });
};

const updateSupplier = async (req, res) => {
  const supplierId = req.params.id;
  const { supplier_name, phone_no, supplier_email, supplier_address } =
    req.body;
  const sql =
    "UPDATE suppliers SET supplier_name = ?, phone_no = ?, supplier_email = ?, supplier_address = ? WHERE id = ?";
  connection.query(
    sql,
    [supplier_name, phone_no, supplier_email, supplier_address, supplierId],
    (err, result) => {
      if (err) {
        console.error("Error updating supplier: " + err.message);
        res.status(500).json({ error: "Error updating supplier" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Supplier not found" });
        return;
      }
      res.status(200).json({ message: "Supplier updated successfully" });
    }
  );
};

const supplierController = {
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  createSupplier,
};
module.exports = supplierController;
