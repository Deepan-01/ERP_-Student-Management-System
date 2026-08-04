const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middleware/authMiddleware");

const {
  addResult,
  getResults,
  deleteResult,
  generateMarksheet,
  exportResultsExcel,
  getStudentResults,
} = require("../controllers/resultController");

router.post("/", authorizeRoles("admin", "staff"), addResult);
router.get("/", authorizeRoles("admin", "staff"), getResults);
router.get("/my-results", authorizeRoles("student"), getStudentResults);
router.get("/marksheet/:id", authorizeRoles("admin", "staff"), generateMarksheet);
router.get("/export/excel", authorizeRoles("admin", "staff"), exportResultsExcel);
router.delete("/:id", authorizeRoles("admin", "staff"), deleteResult);

module.exports = router;
