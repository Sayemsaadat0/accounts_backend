const { connection } = require("../../config");

const getAllSubLedgers = async (req, res) => {
  const sql = "SELECT * FROM sub_ledgers";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting sub ledgers: " + err.message);
      res.status(500).json({ error: "Error getting sub ledgers" });
      return;
    }
    res.status(200).json(results);
  });
};

const createSubLedger = async (req, res) => {
  const { subLedger_code, subLedger_name, ledger_name, project_name, status } =
    req.body;
  console.log({
    subLedger_code,
    subLedger_name,
    ledger_name,
    project_name,
    status,
  });
  const sql =
    "INSERT INTO sub_ledgers (subLedger_code, subLedger_name, ledger_name, project_name, status) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [subLedger_code, subLedger_name, ledger_name, project_name, status],
    (err, result) => {
      if (err) {
        console.error("Error creating sub ledger: " + err.message);
        res.status(500).json({ error: "Error creating sub ledger" });
        return;
      }
      res
        .status(201)
        .json({
          message: "Sub ledger created successfully",
          subLedgerId: result.insertId,
        });
    }
  );
};

const getSubLedgerById = async (req, res) => {
  const subLedgerId = req.params.id;
  const sql = "SELECT * FROM sub_ledgers WHERE id = ?";
  connection.query(sql, [subLedgerId], (err, result) => {
    if (err) {
      console.error("Error getting sub ledger: " + err.message);
      res.status(500).json({ error: "Error getting sub ledger" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Sub ledger not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteSubLedger = async (req, res) => {
  const subLedgerId = req.params.id;
  const sql = "DELETE FROM sub_ledgers WHERE id = ?";
  connection.query(sql, [subLedgerId], (err, result) => {
    if (err) {
      console.error("Error deleting sub ledger: " + err.message);
      res.status(500).json({ error: "Error deleting sub ledger" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Sub ledger not found" });
      return;
    }
    res.status(200).json({ message: "Sub ledger deleted successfully" });
  });
};

const updateSubLedger = async (req, res) => {
  const subLedgerId = req.params.id;
  const { subLedger_code, subLedger_name, ledger_name, project_name, status } =
    req.body;
  const sql =
    "UPDATE sub_ledgers SET subLedger_code = ?, subLedger_name = ?, ledger_name = ?, project_name = ?, status = ? WHERE id = ?";
  connection.query(
    sql,
    [
      subLedger_code,
      subLedger_name,
      ledger_name,
      project_name,
      status,
      subLedgerId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating sub ledger: " + err.message);
        res.status(500).json({ error: "Error updating sub ledger" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Sub ledger not found" });
        return;
      }
      res.status(200).json({ message: "Sub ledger updated successfully" });
    }
  );
};

const subLedgerController = {
  getAllSubLedgers,
  updateSubLedger,
  deleteSubLedger,
  getSubLedgerById,
  createSubLedger,
};

module.exports = subLedgerController;
