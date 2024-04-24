const { connection } = require("../../config");
const useManageBankAccount = require("../../hook/useManageBankAccount");
const generateUniqueId = require("../../middleware/generateUniqueId");

const getAllFixedAssets = async (req, res) => {
  const sql = "SELECT * FROM fixed_assets";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting fixed assets: " + err.message);
      res.status(500).json({ error: "Error getting fixed assets" });
      return;
    }
    res.status(200).json(results);
  });
};

const createFixedAsset = async (req, res) => {
  const uniqueId = generateUniqueId();
  const {
    select_date,
    payment_type,
    deduction_month,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    asset_header,
    quantity,
    company_name,
    project_name,
    account_id,
    transaction_type, // Added account_id for updating the account balance
  } = req.body;

  // Validate if select_date and deduction_month are valid date strings
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  };

  if (!isValidDate(select_date) || !isValidDate(deduction_month)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const formattedSelectedDate = new Date(select_date)
    .toISOString()
    .split("T")[0];
  const formattedDeductionDate = new Date(deduction_month)
    .toISOString()
    .split("T")[0];
  const sql =
    "INSERT INTO fixed_assets (id, select_date, payment_type, deduction_month, actual_amount, paid_amount,  due_amount, note, asset_header, quantity, company_name, project_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    uniqueId,
    formattedSelectedDate,
    payment_type,
    formattedDeductionDate,
    actual_amount,
    paid_amount,
    due_amount,
    note,
    asset_header,
    quantity,
    company_name,
    project_name,
  ];
  useManageBankAccount({
    transaction_type,
    actual_amount,
    account_id,
    sql,
    values,
    connection, // Pass the 'connection' object
  })
    .then((result) => {
      // Handle the result if needed
      console.log(result);
      res.status(201).json({
        message: "Expense created successfully",
        expenseId: result.expenseId,
      });
    })
    .catch((error) => {
      // Handle error if needed
      console.error(error);
      res.status(500).json({ error: "Error creating expense" });
    });
};

const getFixedAssetById = async (req, res) => {
  const assetId = req.params.id;
  const sql = "SELECT * FROM fixed_assets WHERE id = ?";
  connection.query(sql, [assetId], (err, result) => {
    if (err) {
      console.error("Error getting fixed asset: " + err.message);
      res.status(500).json({ error: "Error getting fixed asset" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Fixed asset not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteFixedAsset = async (req, res) => {
  const assetId = req.params.id;
  const sql = "DELETE FROM fixed_assets WHERE id = ?";
  connection.query(sql, [assetId], (err, result) => {
    if (err) {
      console.error("Error deleting fixed asset: " + err.message);
      res.status(500).json({ error: "Error deleting fixed asset" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Fixed asset not found" });
      return;
    }
    res.status(200).json({ message: "Fixed asset deleted successfully" });
  });
};

const updateFixedAsset = async (req, res) => {
  const assetId = req.params.id;
  const {
    select_date,
    payment_type,
    deduction_month,
    actual_amount,
    paid_amount,
    createdAt,
    due_amount,
    note,
    asset_header,
    quantity,
    company_name,
    project_name,
  } = req.body;
  const sql =
    "UPDATE fixed_assets SET select_date = ?, payment_type = ?, deduction_month = ?, actual_amount = ?, paid_amount = ?, createdAt = ?, due_amount = ?, note = ?, asset_header = ?, quantity = ?, company_name = ?, project_name = ?, WHERE id = ?";
  connection.query(
    sql,
    [
      select_date,
      payment_type,
      deduction_month,
      actual_amount,
      paid_amount,
      createdAt,
      due_amount,
      note,
      asset_header,
      quantity,
      company_name,
      project_name,
      assetId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating fixed asset: " + err.message);
        res.status(500).json({ error: "Error updating fixed asset" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Fixed asset not found" });
        return;
      }
      res.status(200).json({ message: "Fixed asset updated successfully" });
    }
  );
};

const fixedAssetController = {
  getAllFixedAssets,
  createFixedAsset,
  getFixedAssetById,
  updateFixedAsset,
  deleteFixedAsset,
};

module.exports = fixedAssetController;
