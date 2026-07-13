const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    rollNo: { type: String, unique: true },
    name: String,
    department: String,
    year: Number,
    email: String,
    phone: String,
    address: String,
    parentName: String,
    parentPhone: String,
    photo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
