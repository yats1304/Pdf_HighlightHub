import { Router } from "express";
import Highlight from "../models/Highlight.js";
import auth from "../middleware/auth.js";

const router = Router();

// Create new highlight
router.post("/", auth, async (req, res) => {
  try {
    const highlight = new Highlight(req.body);
    await highlight.save();
    res.status(201).json(highlight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get highlights for a specific PDF
router.get("/:pdfId", auth, async (req, res) => {
  try {
    const highlights = await Highlight.find({ pdfId: req.params.pdfId });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a highlight
router.put("/:id", auth, async (req, res) => {
  try {
    const highlight = await Highlight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!highlight)
      return res.status(404).json({ message: "Highlight not found" });
    res.json(highlight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a highlight
router.delete("/:id", auth, async (req, res) => {
  try {
    const highlight = await Highlight.findByIdAndDelete(req.params.id);
    if (!highlight)
      return res.status(404).json({ message: "Highlight not found" });
    res.json({ message: "Highlight deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
