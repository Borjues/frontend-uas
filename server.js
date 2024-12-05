require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./models/User");
const Outfit = require("./models/Outfit");

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

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Request Data:", { username, email, password: hashedPassword });

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error in /register route:", err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Bandingkan password yang dimasukkan dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).send({ message: "Login successful", userId: user._id });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

app.put("/user/:userId", async (req, res) => {
  try {
    const { username } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({
      username: username,
      _id: { $ne: req.params.userId },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { username: username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Username updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating username", error: err.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    await Outfit.deleteMany({ user: req.params.id });

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user data
app.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: err.message });
  }
});

// Get outfits
app.get("/outfits/user/:userId", async (req, res) => {
  try {
    const outfits = await Outfit.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(outfits);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching outfits", error: err.message });
  }
});

// Create outfit
app.post("/outfits", async (req, res) => {
  try {
    const { name, description, image, userId } = req.body;

    if (!name || !description || !image || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOutfit = new Outfit({
      name,
      description,
      image,
      user: userId,
    });

    await newOutfit.save();
    res
      .status(201)
      .json({ message: "Outfit created successfully!", outfit: newOutfit });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating outfit", error: err.message });
  }
});

app.get("/outfits", async (req, res) => {
  try {
    const outfits = await Outfit.find()
      .populate('user', 'username') // This populates the user information
      .sort({ createdAt: -1 });
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: "Error fetching outfits", error: err.message });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
