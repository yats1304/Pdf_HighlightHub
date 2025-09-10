import express from "express";
import auth from "../middleware/auth.js";
import PDF from "../models/Pdf.js";
import Highlight from "../models/Highlight.js";

const router = express.Router();

router.get("/search", auth, async (req, res) => {
  const { q } = req.query;
  if (!q)
    return res.status(400).json({ message: "Query parameter 'q' is required" });

  try {
    const pdfResults = await PDF.find({ $text: { $search: q } });
    const highlightResults = await Highlight.find({ $text: { $search: q } });

    res.json({ pdfResults, highlightResults });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
