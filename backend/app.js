import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import pdfRoutes from "./routes/pdf.js";
import highlightRoutes from "./routes/highlight.js";
import PDF from "./models/Pdf.js";
import Highlight from "./models/Highlight.js";
import searchRoutes from "./routes/search.js";

dotenv.config();

const app = express();

// Configure CORS with options
const corsOptions = {
  origin: "http://localhost:3000", // your Next.js frontend URL
  credentials: true, // if you use cookies/auth headers
};

app.use(express.json());
app.use(cors(corsOptions));

// Use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/highlights", highlightRoutes);
app.use("/api", searchRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");

    // Create text indexes once on server startup
    try {
      await PDF.collection.createIndex({ originalName: "text" });
      await Highlight.collection.createIndex({ text: "text" });
      console.log("Text indexes created successfully");
    } catch (error) {
      console.error("Error creating text indexes:", error);
    }
  })
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
