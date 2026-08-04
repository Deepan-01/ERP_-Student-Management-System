const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
