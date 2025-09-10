import { Router } from "express";
import Highlight from "../models/Highlight.js";
import auth from "../middleware/auth.js";

const router = Router();

// Create new highlight
router.post("/", auth, async (req, res) => {
  try {
    const { pdfId, userId, pageNumber, text, position, color, notes, tags } =
      req.body;

    const highlight = new Highlight({
      pdfId,
      userId,
      pageNumber,
      text,
      position,
      color,
      notes,
      tags,
    });

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
    const { pdfId, userId, pageNumber, text, position, color, notes, tags } =
      req.body;

    const updatedFields = {
      pdfId,
      userId,
      pageNumber,
      text,
      position,
      color,
      notes,
      tags,
    };

    // Remove undefined fields for partial update
    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key]
    );

    const highlight = await Highlight.findByIdAndUpdate(
      req.params.id,
      updatedFields,
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
