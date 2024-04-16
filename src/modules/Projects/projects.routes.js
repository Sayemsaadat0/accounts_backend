const express = require("express");
const projectController = require("./projects.controller");
const router = express.Router();

router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

module.exports = { projectsRoutes: router };
