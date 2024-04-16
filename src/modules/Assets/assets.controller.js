const { connection } = require("../../config");

const getAllAssets = async (req, res) => {
  const sql = "SELECT * FROM assets";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting assets: " + err.message);
      res.status(500).json({ error: "Error getting assets" });
      return;
    }
    res.status(200).json(results);
  });
};

const createAsset = async (req, res) => {
  const { assets_head, assets_qty, deduction_month, total_amount } = req.body;
  console.log({ assets_head, assets_qty, deduction_month, total_amount });
  const sql =
    "INSERT INTO assets (assets_head, assets_qty, deduction_month, total_amount) VALUES (?, ?, ?, ?)";
  connection.query(
    sql,
    [assets_head, assets_qty, deduction_month, total_amount],
    (err, result) => {
      if (err) {
        console.error("Error creating asset: " + err.message);
        res.status(500).json({ error: "Error creating asset" });
        return;
      }
      res
        .status(201)
        .json({
          message: "Asset created successfully",
          assetId: result.insertId,
        });
    }
  );
};

const getAssetById = async (req, res) => {
  const assetId = req.params.id;
  const sql = "SELECT * FROM assets WHERE id = ?";
  connection.query(sql, [assetId], (err, result) => {
    if (err) {
      console.error("Error getting asset: " + err.message);
      res.status(500).json({ error: "Error getting asset" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Asset not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteAsset = async (req, res) => {
  const assetId = req.params.id;
  const sql = "DELETE FROM assets WHERE id = ?";
  connection.query(sql, [assetId], (err, result) => {
    if (err) {
      console.error("Error deleting asset: " + err.message);
      res.status(500).json({ error: "Error deleting asset" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Asset not found" });
      return;
    }
    res.status(200).json({ message: "Asset deleted successfully" });
  });
};

const updateAsset = async (req, res) => {
  const assetId = req.params.id;
  const { assets_head, assets_qty, deduction_month, total_amount } = req.body;
  const sql =
    "UPDATE assets SET assets_head = ?, assets_qty = ?, deduction_month = ?, total_amount = ? WHERE id = ?";
  connection.query(
    sql,
    [assets_head, assets_qty, deduction_month, total_amount, assetId],
    (err, result) => {
      if (err) {
        console.error("Error updating asset: " + err.message);
        res.status(500).json({ error: "Error updating asset" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Asset not found" });
        return;
      }
      res.status(200).json({ message: "Asset updated successfully" });
    }
  );
};

const assetController = {
  getAllAssets,
  updateAsset,
  deleteAsset,
  getAssetById,
  createAsset,
};

module.exports = assetController;
