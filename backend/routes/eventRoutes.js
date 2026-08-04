const express = require("express");
const router = express.Router();
const { auth, authorizeRoles } = require("../middleware/authMiddleware");

const { addEvent, getUpcoming, deleteEvent } = require("../controllers/eventController");

router.post("/", auth, authorizeRoles("admin"), addEvent);
router.get("/upcoming", getUpcoming);
router.delete("/:id", auth, authorizeRoles("admin"), deleteEvent);

module.exports = router;
