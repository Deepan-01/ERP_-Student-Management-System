require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

const staffAccounts = [
  { name: "CSE Staff", email: "cse@erp.com", password: "cse123", department: "CSE" },
  { name: "IT Staff", email: "it@erp.com", password: "it123", department: "IT" },
  { name: "CSBS Staff", email: "csbs@erp.com", password: "csbs123", department: "CSBS" },
  { name: "CSE(AIML) Staff", email: "aiml@erp.com", password: "aiml123", department: "CSE(AIML)" },
];

const seedDefaults = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({ name: "Admin", email: "admin@erp.com", password: hashed, role: "admin", department: "CSE" });
      console.log("Default admin created: admin@erp.com / admin123");
    }
    for (const acct of staffAccounts) {
      const exists = await User.findOne({ email: acct.email });
      if (!exists) {
        const hashed = await bcrypt.hash(acct.password, 10);
        await User.create({ name: acct.name, email: acct.email, password: hashed, role: "staff", department: acct.department });
        console.log(`Staff created: ${acct.email} / ${acct.password} (${acct.department})`);
      }
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

// Routes Import
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const resultRoutes = require("./routes/resultRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const eventRoutes = require("./routes/eventRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const { auth, authorizeRoles } = require("./middleware/authMiddleware");

const app = express();

// Database Connection
connectDB().then(seedDefaults);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", auth, authorizeRoles("admin", "staff"), studentRoutes);
app.use("/api/dashboard", auth, authorizeRoles("admin", "staff"), dashboardRoutes);
app.use("/api/attendance", auth, authorizeRoles("admin", "staff"), attendanceRoutes);
app.use("/api/results", auth, resultRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/leaves", leaveRoutes);

app.get("/", (req, res) => {
  res.send("ERP Backend Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
