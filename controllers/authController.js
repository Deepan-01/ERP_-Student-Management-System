const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Simple in-memory captcha store
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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.role !== "admin" && user.role !== "staff") return res.status(403).json({ msg: "Access denied" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid Password" });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, department: user.department }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { rollNo } = req.body;
    const student = await Student.findOne({ rollNo });
    if (!student) return res.status(400).json({ msg: "Student not found" });

    const token = jwt.sign({ rollNo: student.rollNo, role: "student", name: student.name, department: student.department }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { rollNo: student.rollNo, name: student.name, role: "student", department: student.department } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};
