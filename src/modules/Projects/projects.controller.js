const { connection } = require("../../config");
const generateUniqueId = require("../../middleware/generateUniqueId");

const getAllProjects = async (req, res) => {
  const sql = "SELECT * FROM projects";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error getting projects: " + err.message);
      res.status(500).json({ error: "Error getting projects" });
      return;
    }
    res.status(200).json(results);
  });
};

const createProject = async (req, res) => {
  const uniqueId = generateUniqueId();
  const { project_code, project_name, company_name, status } = req.body;
  // console.log({ project_code, project_name, company_name, status });
  const sql =
    "INSERT INTO projects (id,project_code, project_name, company_name, status) VALUES (?,?, ?, ?, ?)";
  connection.query(
    sql,
    [uniqueId, project_code, project_name, company_name, status],
    (err, result) => {
      if (err) {
        console.error("Error creating project: " + err.message);
        res.status(500).json({ error: "Error creating project" });
        return;
      }
      res.status(201).json({
        message: "Project created successfully",
        projectId: result.insertId,
      });
    }
  );
};

const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  const sql = "SELECT * FROM projects WHERE id = ?";
  connection.query(sql, [projectId], (err, result) => {
    if (err) {
      console.error("Error getting project: " + err.message);
      res.status(500).json({ error: "Error getting project" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(200).json(result[0]);
  });
};

const deleteProject = async (req, res) => {
  const projectId = req.params.id;
  const sql = "DELETE FROM projects WHERE id = ?";
  connection.query(sql, [projectId], (err, result) => {
    if (err) {
      console.error("Error deleting project: " + err.message);
      res.status(500).json({ error: "Error deleting project" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(200).json({ message: "Project deleted successfully" });
  });
};

const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const { project_code, project_name, company_name, status } = req.body;
  const sql =
    "UPDATE projects SET project_code = ?, project_name = ?, company_name = ?, status = ? WHERE id = ?";
  connection.query(
    sql,
    [project_code, project_name, company_name, status, projectId],
    (err, result) => {
      if (err) {
        console.error("Error updating project: " + err.message);
        res.status(500).json({ error: "Error updating project" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.status(200).json({ message: "Project updated successfully" });
    }
  );
};

const projectController = {
  getAllProjects,
  updateProject,
  deleteProject,
  getProjectById,
  createProject,
};

module.exports = projectController;
