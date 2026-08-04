const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");

// Department Wise Student Count
exports.getDepartmentStats = async (req, res) => {
  try {
    const departments = await Student.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(departments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Dashboard Main Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalResults = await Result.countDocuments();

    const totalPassed = await Result.countDocuments({
      percentage: { $gte: 40 },
    });

    const totalFailed = await Result.countDocuments({
      percentage: { $lt: 40 },
    });

    const passPercentage =
      totalResults > 0
        ? ((totalPassed / totalResults) * 100).toFixed(2)
        : 0;

    res.json({
      totalStudents,
      totalAttendance,
      totalResults,
      totalPassed,
      totalFailed,
      passPercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Department Wise Result Statistics
exports.getDepartmentResultStats = async (req, res) => {
  try {
    const stats = await Result.aggregate([
      {
        $group: {
          _id: "$department",

          totalStudents: {
            $sum: 1,
          },

          passed: {
            $sum: {
              $cond: [
                { $gte: ["$percentage", 40] },
                1,
                0,
              ],
            },
          },

          failed: {
            $sum: {
              $cond: [
                { $lt: ["$percentage", 40] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const finalStats = stats.map((item) => ({
      ...item,
      passPercentage:
        item.totalStudents > 0
          ? (
              (item.passed / item.totalStudents) *
              100
            ).toFixed(2)
          : 0,
    }));

    res.json(finalStats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Department Wise Topper
exports.getDepartmentToppers = async (req, res) => {
  try {
    const toppers = await Result.aggregate([
      {
        $sort: {
          percentage: -1,
        },
      },
      {
        $group: {
          _id: "$department",
          topperName: {
            $first: "$name",
          },
          rollNo: {
            $first: "$rollNo",
          },
          percentage: {
            $first: "$percentage",
          },
          grade: {
            $first: "$grade",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json(toppers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getSemesterStats = async (req, res) => {
  try {
    const stats = await Result.aggregate([
      {
        $group: {
          _id: "$semester",

          totalStudents: {
            $sum: 1,
          },

          passed: {
            $sum: {
              $cond: [
                { $gte: ["$percentage", 40] },
                1,
                0,
              ],
            },
          },

          failed: {
            $sum: {
              $cond: [
                { $lt: ["$percentage", 40] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};