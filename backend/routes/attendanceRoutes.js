const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendancePercentage,
  getLowAttendanceStudents,
  getMonthlyAttendanceReport,
  getDepartmentAttendanceStats,
  exportAttendanceExcel,
} = require("../controllers/attendanceController");

router.post("/", markAttendance);
router.get("/", getAttendance);

router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

router.get("/percentage/:rollNo", getAttendancePercentage);
router.get("/low", getLowAttendanceStudents);
router.get("/monthly", getMonthlyAttendanceReport);
router.get("/department", getDepartmentAttendanceStats);
router.get("/export/excel", exportAttendanceExcel);

module.exports = router;