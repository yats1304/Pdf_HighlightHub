import { Router } from "express";
import auth from "../middleware/auth.js";
import Highlight from "../models/Highlight.js";
import Pdf from "../models/Pdf.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch last 10 uploads
    const pdfs = await Pdf.find({ userId })
      .sort({ uploadDate: -1 })
      .limit(10)
      .lean();

    // Fetch last 10 highlights
    const highlights = await Highlight.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Unify format for frontend consumption
    const pdfActivities = pdfs.map((pdf) => ({
      id: `pdf-${pdf._id}`,
      message: "You uploaded",
      file: pdf.originalName,
      when: pdf.uploadDate || "",
    }));

    const highlightActivities = highlights.map((hl) => ({
      id: `highlight-${hl._id}`,
      message: "You added a highlight",
      file: hl.text.length > 30 ? hl.text.slice(0, 30) + "..." : hl.text,
      when: hl.createdAt || "",
    }));

    // Combine and sort by date
    const allActivities = [...pdfActivities, ...highlightActivities].sort(
      (a, b) => new Date(b.when) - new Date(a.when)
    );

    // Limit to 10 most recent actions
    res.json(allActivities.slice(0, 10));
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ message: "Server error fetching activity" });
  }
});

export default router;
