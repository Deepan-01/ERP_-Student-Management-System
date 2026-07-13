const Leave = require("../models/Leave");
const Student = require("../models/Student");

exports.applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;
    const student = await Student.findOne({ rollNo: req.user.rollNo });
    const leave = await Leave.create({
      rollNo: req.user.rollNo,
      name: req.user.name,
      department: student?.department || "",
      fromDate, toDate, reason,
    });
    res.status(201).json(leave);
  } catch (error) {
    console.error("Apply Leave Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ rollNo: req.user.rollNo }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "staff") {
      filter.department = req.user.department;
    }
    if (req.query.status) filter.status = req.query.status;
    const leaves = await Leave.find(filter).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
