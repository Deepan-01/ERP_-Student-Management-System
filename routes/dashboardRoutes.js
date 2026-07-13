const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getDepartmentStats,
  getDepartmentResultStats,
  getSemesterStats,
  getDepartmentToppers,
} = require("../controllers/dashboardController");

router.get("/stats", getDashboardStats);
router.get("/departments", getDepartmentStats);
router.get("/result-stats", getDepartmentResultStats);
router.get("/semester-stats", getSemesterStats);
router.get("/toppers", getDepartmentToppers);

module.exports = router;
