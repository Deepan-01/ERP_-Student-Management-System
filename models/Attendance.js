const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "On Duty"],
    },
    absentReason: { type: String, default: "" },
    odReason: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
