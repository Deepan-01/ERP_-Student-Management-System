require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteOne({ email: "staff@erp.com" });
  console.log("Removed old staff@erp.com");

  const accounts = [
    { name: "CSE Staff", email: "cse@erp.com", password: "cse123", department: "CSE" },
    { name: "IT Staff", email: "it@erp.com", password: "it123", department: "IT" },
    { name: "CSBS Staff", email: "csbs@erp.com", password: "csbs123", department: "CSBS" },
    { name: "CSE(AIML) Staff", email: "aiml@erp.com", password: "aiml123", department: "CSE(AIML)" },
  ];

  for (const a of accounts) {
    const exists = await User.findOne({ email: a.email });
    if (!exists) {
      const hashed = await bcrypt.hash(a.password, 10);
      await User.create({ name: a.name, email: a.email, password: hashed, role: "staff", department: a.department });
      console.log("Created:", a.email, "/", a.password, "(" + a.department + ")");
    } else {
      console.log("Exists:", a.email);
    }
  }

  const all = await User.find({});
  console.log("\nAll users:");
  all.forEach(u => console.log("  " + u.email + " | " + u.role + " | " + u.department));
  await mongoose.disconnect();
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
