import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import Pdf from "../models/Pdf.js";

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload PDF endpoint
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, filename } = req.file;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    // Save PDF metadata
    const newPdf = new Pdf({
      uuid: filename.split("-")[0],
      originalName: originalname,
      userId,
    });

    await newPdf.save();

    res.status(201).json({
      message: "PDF uploaded successfully",
      pdfId: newPdf._id,
      uuid: newPdf.uuid,
      originalName: newPdf.originalName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during file upload" });
  }
});

export default router;
