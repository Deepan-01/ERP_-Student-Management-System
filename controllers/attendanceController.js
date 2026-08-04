const XLSX = require("xlsx");
const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const { rollNo, name, department, status, absentReason, odReason } = req.body;
    const attendance = await Attendance.create({ rollNo, name, department, status, absentReason, odReason });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "staff" && req.user.department) {
      filter.department = req.user.department;
    } else if (req.query.department) {
      filter.department = req.query.department;
    }
    if (req.query.date) {
      const start = new Date(req.query.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(req.query.date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    const attendance = await Attendance.find(filter);
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendancePercentage = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const records = await Attendance.find({ rollNo });

    const totalDays = records.length;
    const presentDays = records.filter(
      (item) => item.status === "Present" || item.status === "On Duty"
    ).length;

    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({ rollNo, totalDays, presentDays, percentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowAttendanceStudents = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    const studentMap = {};

    attendance.forEach((item) => {
      if (!studentMap[item.rollNo]) {
        studentMap[item.rollNo] = { rollNo: item.rollNo, name: item.name, total: 0, present: 0 };
      }
      studentMap[item.rollNo].total++;
      if (item.status === "Present" || item.status === "On Duty") {
        studentMap[item.rollNo].present++;
      }
    });

    const lowAttendance = Object.values(studentMap)
      .filter((student) => (student.present / student.total) * 100 < 75)
      .map((student) => ({ ...student, percentage: ((student.present / student.total) * 100).toFixed(2) }));

    res.status(200).json(lowAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyAttendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    const report = {};

    attendance.forEach((item) => {
      const month = new Date(item.date).toLocaleString("default", { month: "long", year: "numeric" });
      report[month] = (report[month] || 0) + 1;
    });

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDepartmentAttendanceStats = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      { $group: { _id: "$department", totalRecords: { $sum: 1 } } },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportAttendanceExcel = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    const data = attendance.map((item) => ({
      RollNo: item.rollNo,
      Name: item.name,
      Department: item.department,
      Status: item.status,
      Date: item.date ? new Date(item.date).toLocaleDateString() : "",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=attendance.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
