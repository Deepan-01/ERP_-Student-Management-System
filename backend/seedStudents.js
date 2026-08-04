require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

const students = [
  { rollNo: "23CS001", name: "Arun Kumar", department: "CSE", year: 3, email: "arun@student.com", address: "Chennai", parentName: "Kumar", parentPhone: "9876543210" },
  { rollNo: "23CS002", name: "Priya Devi", department: "CSE", year: 3, email: "priya@student.com", address: "Coimbatore", parentName: "Devi", parentPhone: "9876543211" },
  { rollNo: "23IT001", name: "Ravi Shankar", department: "IT", year: 3, email: "ravi@student.com", address: "Madurai", parentName: "Shankar", parentPhone: "9876543212" },
  { rollNo: "23IT002", name: "Meena Raj", department: "IT", year: 3, email: "meena@student.com", address: "Salem", parentName: "Raj", parentPhone: "9876543213" },
  { rollNo: "23BS001", name: "Karthik Selvan", department: "CSBS", year: 3, email: "karthik@student.com", address: "Trichy", parentName: "Selvan", parentPhone: "9876543214" },
  { rollNo: "23BS002", name: "Nithya Rani", department: "CSBS", year: 3, email: "nithya@student.com", address: "Erode", parentName: "Rani", parentPhone: "9876543215" },
  { rollNo: "23AL001", name: "Vikram Raj", department: "CSE(AIML)", year: 3, email: "vikram@student.com", address: "Chennai", parentName: "Raj", parentPhone: "9876543216" },
  { rollNo: "23AL002", name: "Sneha Patel", department: "CSE(AIML)", year: 3, email: "sneha@student.com", address: "Bangalore", parentName: "Patel", parentPhone: "9876543217" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  let created = 0;
  for (const s of students) {
    const exists = await Student.findOne({ rollNo: s.rollNo });
    if (!exists) {
      await Student.create(s);
      created++;
      console.log("Created:", s.rollNo, s.name, "(" + s.department + ")");
    } else {
      console.log("Exists:", s.rollNo);
    }
  }
  console.log("\nTotal students:", await Student.countDocuments());
  await mongoose.disconnect();
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
