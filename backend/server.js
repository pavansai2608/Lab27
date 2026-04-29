require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MONGODB CONNECTION (ATLAS)
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { dbName: "Ass27"})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Error:", err));

// Routes
app.use("/api", require("./routes"));

// Server
app.listen(5001, () => console.log("🚀 Server running on 5001"));