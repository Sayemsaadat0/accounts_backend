const { connection } = require("../../config");
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
    account_id, // Added account_id for updating the account balance
  } = req.body;

  const formattedSelectedDate = new Date(select_date)
    .toISOString()
    .split("T")[0];
  const formattedDeductionDate = new Date(deduction_month)
    .toISOString()
    .split("T")[0];
  const sql =
    "INSERT INTO fixed_assets (id, select_date, payment_type, deduction_month, actual_amount, paid_amount,  due_amount, note, asset_header, quantity, company_name, project_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  // Deduct expense from the selected account balance for expenses
  let updateOperator = "-";
  if (
    payment_type === "income" ||
    payment_type === "account_Recivable" ||
    payment_type === "sales"
  ) {
    updateOperator = "+";
  }

  connection.beginTransaction(function (err) {
    if (err) {
      console.error("Error starting transaction: " + err.message);
      res.status(500).json({ error: "Error creating fixed asset" });
      return;
    }

    connection.query(
      sql,
      [
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
      ],
      function (err, result) {
        if (err) {
          return connection.rollback(function () {
            console.error("Error creating fixed asset: " + err.message);
            res.status(500).json({ error: "Error creating fixed asset" });
          });
        }

        // Update the account balance
        const updateBalanceSql = `UPDATE accounts SET balance = balance ${updateOperator} ? WHERE id = ?`;
        const updateBalanceValues = [actual_amount, account_id];
        connection.query(updateBalanceSql, updateBalanceValues, function (err) {
          if (err) {
            return connection.rollback(function () {
              console.error("Error updating account balance: " + err.message);
              res.status(500).json({ error: "Error creating fixed asset" });
            });
          }

          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                console.error("Error committing transaction: " + err.message);
                res.status(500).json({ error: "Error creating fixed asset" });
              });
            }
            res.status(201).json({
              message: "Fixed asset created successfully",
              assetId: result.insertId,
            });
          });
        });
      }
    );
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
