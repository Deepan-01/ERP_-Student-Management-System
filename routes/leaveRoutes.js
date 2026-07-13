const express = require("express");
const router = express.Router();
const { auth, authorizeRoles } = require("../middleware/authMiddleware");

const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require("../controllers/leaveController");

router.post("/", auth, authorizeRoles("student"), applyLeave);
router.get("/my", auth, authorizeRoles("student"), getMyLeaves);
router.get("/all", auth, authorizeRoles("admin", "staff"), getAllLeaves);
router.put("/:id", auth, authorizeRoles("admin", "staff"), updateLeaveStatus);

module.exports = router;
