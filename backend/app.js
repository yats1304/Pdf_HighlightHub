import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"; // Import auth routes

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Use auth routes
app.use("/api/auth", authRoutes); // Mount auth routes at /api/auth

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic sanity check route
app.get("/", (req, res) => {
  res.send("PDF Annotator Backend is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
