const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  exportStudentsExcel,
} = require("../controllers/studentController");

// Upload Folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

// Routes

router.post("/", createStudent);

router.get("/", getStudents);

router.get("/export/excel", exportStudentsExcel);

router.get("/:id", getStudent);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

module.exports = router;