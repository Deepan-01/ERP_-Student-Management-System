const mongoose = require("mongoose");
const mongoMock = require("mongo-mock");
const fs = require("fs");
const path = require("path");

let usingMock = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ MongoDB Connected");
  } catch (err) {
    console.warn("⚠ MongoDB not available. Using mock database...");
    usingMock = true;
    
    // Use mongo-mock as fallback
    mongoMock.MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        console.log("✓ Mock database initialized");
      }
    });
  }
};

module.exports = connectDB;
module.exports.usingMock = () => usingMock;