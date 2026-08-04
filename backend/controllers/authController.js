const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hardcodedStaff = {
  "admin@erp.com": { password: "admin123", name: "Admin", role: "admin", department: "CSE" },
  "cse@erp.com": { password: "cse123", name: "CSE Staff", role: "staff", department: "CSE" },
  "it@erp.com": { password: "it123", name: "IT Staff", role: "staff", department: "IT" },
  "csbs@erp.com": { password: "csbs123", name: "CSBS Staff", role: "staff", department: "CSBS" },
  "aiml@erp.com": { password: "aiml123", name: "CSE(AIML) Staff", role: "staff", department: "CSE(AIML)" },
};

const hardcodedStudents = {
  "23CS001": { name: "Arun Kumar", department: "CSE" },
  "23CS002": { name: "Priya Devi", department: "CSE" },
  "23IT001": { name: "Ravi Shankar", department: "IT" },
  "23IT002": { name: "Meena Raj", department: "IT" },
  "23BS001": { name: "Karthik Selvan", department: "CSBS" },
  "23BS002": { name: "Nithya Rani", department: "CSBS" },
  "23AL001": { name: "Vikram Raj", department: "CSE(AIML)" },
  "23AL002": { name: "Sneha Patel", department: "CSE(AIML)" },
};

const captchaStore = {};

exports.getCaptcha = (req, res) => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = num1 + num2;
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  captchaStore[id] = { answer, expires: Date.now() + 120000 };
  res.json({ captchaId: id, question: `${num1} + ${num2} = ?` });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "staff", department });
    const token = jwt.sign({ id: user._id, role: user.role, department: user.department }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hc = hardcodedStaff[email];
    if (!hc) return res.status(400).json({ msg: "User not found" });
    if (password !== hc.password) return res.status(400).json({ msg: "Invalid Password" });
    let userId = "hardcoded";
    try {
      let user = await User.findOne({ email });
      if (!user) user = await User.create({ name: hc.name, email, password: hc.password, role: hc.role, department: hc.department });
      userId = user._id;
    } catch (_) {}
    const token = jwt.sign({ id: userId, role: hc.role, name: hc.name, department: hc.department }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: userId, name: hc.name, email, role: hc.role, department: hc.department } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { rollNo } = req.body;
    const hc = hardcodedStudents[rollNo];
    if (!hc) return res.status(400).json({ msg: "Student not found" });
    try {
      let student = await Student.findOne({ rollNo });
      if (!student) await Student.create({ rollNo, name: hc.name, department: hc.department, year: 3 });
    } catch (_) {}
    const token = jwt.sign({ rollNo, role: "student", name: hc.name, department: hc.department }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { rollNo, name: hc.name, role: "student", department: hc.department } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};
