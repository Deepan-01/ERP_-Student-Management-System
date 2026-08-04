const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    rollNo: String,
    name: String,
    department: String,
    semester: { type: Number, required: true },
    subject1: Number,
    subject2: Number,
    subject3: Number,
    subject4: Number,
    subject5: Number,
    subject6: Number,
    subject7: Number,
    total: Number,
    percentage: Number,
    gpa: Number,
    grade: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
