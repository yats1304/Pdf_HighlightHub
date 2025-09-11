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
router.post("/uploads", auth, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, filename } = req.file;
    const userId = req.user.userId; // Authenticated user ID

    // Save PDF metadata
    const newPdf = new Pdf({
      uuid: filename.split("-")[0],
      originalName: originalname,
      filename,
      userId,
      uploadDate: new Date(),
      status: "Pending",
    });

    await newPdf.save();

    res.status(201).json({
      message: "PDF uploaded successfully",
      pdfId: newPdf._id,
      uuid: newPdf.uuid,
      originalName: newPdf.originalName,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "Server error during file upload" });
  }
});

// Get PDFs uploaded by authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const pdfs = await Pdf.find({ userId }).lean().exec();

    const result = pdfs.map((pdf) => ({
      id: pdf._id.toString(),
      name: pdf.originalName || pdf.name,
      status: pdf.status || "Pending",
      uploaded: pdf.uploadDate || new Date(),
      thumbnail: pdf.thumbnailUrl || "",
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching PDFs for dashboard:", error);
    res.status(500).json({ message: "Server error fetching PDFs" });
  }
});

// Get single PDF by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }
    res.json(pdf);
  } catch (error) {
    console.error("Error fetching PDF by ID:", error);
    res.status(500).json({ message: "Server error fetching PDF" });
  }
});

// Delete PDF endpoint
router.delete("/:pdfId", auth, async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.pdfId);

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // Only owner can delete
    if (pdf.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Forbidden" });

    await pdf.deleteOne();

    res.json({ message: "PDF deleted successfully" });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    res.status(500).json({ message: "Server error deleting PDF" });
  }
});

// Share PDF with another user
router.post("/:pdfId/share", auth, async (req, res) => {
  try {
    const { userIdToShare, permission } = req.body;
    const pdf = await Pdf.findById(req.params.pdfId);

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    if (pdf.userId.toString() !== req.user.userId)
      return res
        .status(403)
        .json({ message: "Forbidden, only owner can share" });

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
    console.error("Error sharing PDF:", error);
    res.status(500).json({ message: "Server error during sharing" });
  }
});

// Unshare PDF from a user
router.post("/:pdfId/unshare", auth, async (req, res) => {
  try {
    const { userIdToUnshare } = req.body;
    const pdf = await Pdf.findById(req.params.pdfId);

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

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
    console.error("Error unsharing PDF:", error);
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
    console.error("Error fetching shared PDFs:", error);
    res.status(500).json({ message: "Server error fetching shared PDFs" });
  }
});

export default router;
