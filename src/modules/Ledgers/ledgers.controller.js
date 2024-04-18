const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");

const getAllLedgers = async (req, res) => {
  const sql = "SELECT * FROM ledgers";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting ledgers: " + err.message);
      res.status(500).json({ error: "Error getting ledgers" });
      return;
    }
    res.status(200).json(results);
  });
};

const createLedger = async (req, res) => {
  const uniqueId = generateUniqueId();
  const { ledger_code, ledger_name, project_name, status } = req.body;
  const sql =
    "INSERT INTO ledgers (id,ledger_code, ledger_name, project_name, status) VALUES (?,?, ?, ?, ?)";
  connection.query(
    sql,
    [uniqueId, ledger_code, ledger_name, project_name, status],
    (err, result) => {
      if (err) {
        console.error("Error creating ledger: " + err.message);
        res.status(500).json({ error: "Error creating ledger" });
        return;
      }
      res.status(201).json({
        message: "Ledger created successfully",
        ledgerId: result.insertId,
      });
    }
  );
};

const getLedgerById = async (req, res) => {
  const ledgerId = req.params.id;
  const sql = "SELECT * FROM ledgers WHERE id = ?";
  connection.query(sql, [ledgerId], (err, result) => {
    if (err) {
      console.error("Error getting ledger: " + err.message);
      res.status(500).json({ error: "Error getting ledger" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Ledger not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteLedger = async (req, res) => {
  const ledgerId = req.params.id;
  const sql = "DELETE FROM ledgers WHERE id = ?";
  connection.query(sql, [ledgerId], (err, result) => {
    if (err) {
      console.error("Error deleting ledger: " + err.message);
      res.status(500).json({ error: "Error deleting ledger" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Ledger not found" });
      return;
    }
    res.status(200).json({ message: "Ledger deleted successfully" });
  });
};

const updateLedger = async (req, res) => {
  const ledgerId = req.params.id;
  const { ledger_code, ledger_name, project_name, status } = req.body;
  const sql =
    "UPDATE ledgers SET ledger_code = ?, ledger_name = ?, project_name = ?, status = ? WHERE id = ?";
  connection.query(
    sql,
    [ledger_code, ledger_name, project_name, status, ledgerId],
    (err, result) => {
      if (err) {
        console.error("Error updating ledger: " + err.message);
        res.status(500).json({ error: "Error updating ledger" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Ledger not found" });
        return;
      }
      res.status(200).json({ message: "Ledger updated successfully" });
    }
  );
};

const ledgerController = {
  getAllLedgers,
  updateLedger,
  deleteLedger,
  getLedgerById,
  createLedger,
};

module.exports = ledgerController;
