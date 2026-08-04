const XLSX = require("xlsx");
const Student = require("../models/Student");

exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create({
      rollNo: req.body.rollNo,
      name: req.body.name,
      department: req.body.department,
      year: Number(req.body.year) || 0,
      email: req.body.email,
      address: req.body.address,
      parentName: req.body.parentName,
      parentPhone: req.body.parentPhone,
      phone: req.body.phone || "",
    });

    res.status(201).json({ success: true, student });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Roll Number Already Exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "staff" && req.user.department) {
      filter.department = req.user.department;
    } else if (req.query.department) {
      filter.department = req.query.department;
    }
    const students = await Student.find(filter);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student Not Found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updateData = { ...req.body, year: Number(req.body.year) || 0 };
    const student = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!student) return res.status(404).json({ message: "Student Not Found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student Not Found" });
    res.status(200).json({ message: "Student Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportStudentsExcel = async (req, res) => {
  try {
    const students = await Student.find();
    const data = students.map((student) => ({
      RollNo: student.rollNo,
      Name: student.name,
      Department: student.department,
      Year: student.year,
      Email: student.email,
      Phone: student.phone,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
