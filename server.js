require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User"); // Import User model

const app = express();
const PORT = process.env.PORT;

const dbURL = process.env.MONGODB_URL;

// Middleware CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://127.0.0.1:5500"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Izinkan akses
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Middleware untuk parsing body request
app.use(bodyParser.json());

// Koneksi ke MongoDB
mongoose
  .connect(dbURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Route untuk registrasi user
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("Request Data:", { username, email, password }); // Debug input

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error in /register route:", err); // Log error stack
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).send({ message: "Login successful" });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
