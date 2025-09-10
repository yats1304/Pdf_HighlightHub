import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import Pdf from "../models/Pdf.js";
import auth from "../middleware/auth.js";

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
router.post("/upload", auth, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, filename } = req.file;
    const userId = req.user.userId; // Use authenticated user ID

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

// Share PDF with another user
router.post("/:pdfId/share", auth, async (req, res) => {
  try {
    const { userIdToShare, permission } = req.body;
    const pdf = await Pdf.findById(req.params.pdfId);

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // Only owner can share
    if (pdf.userId.toString() !== req.user.userId)
      return res
        .status(403)
        .json({ message: "Forbidden, only owner can share" });

    // Add or update shared user permission
    const existingEntry = pdf.sharedWith.find(
      (entry) => entry.userId.toString() === userIdToShare
    );

    if (existingEntry) {
      existingEntry.permission = permission;
    } else {
      pdf.sharedWith.push({ userId: userIdToShare, permission });
    }

    await pdf.save();
    res.json({ message: "PDF shared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during sharing" });
  }
});

// Unshare PDF from a user
router.post("/:pdfId/unshare", auth, async (req, res) => {
  try {
    const { userIdToUnshare } = req.body;
    const pdf = await Pdf.findById(req.params.pdfId);

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // Only owner can unshare
    if (pdf.userId.toString() !== req.user.userId)
      return res
        .status(403)
        .json({ message: "Forbidden, only owner can unshare" });

    pdf.sharedWith = pdf.sharedWith.filter(
      (entry) => entry.userId.toString() !== userIdToUnshare
    );

    await pdf.save();
    res.json({ message: "PDF unshared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during unsharing" });
  }
});

// Get PDFs shared with the authenticated user
router.get("/shared/me", auth, async (req, res) => {
  try {
    const sharedPdfs = await Pdf.find({
      "sharedWith.userId": req.user.userId,
    });

    res.json(sharedPdfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching shared PDFs" });
  }
});

export default router;
