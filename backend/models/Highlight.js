import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    pdfId: { type: mongoose.Schema.Types.ObjectId, ref: "Pdf", required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pageNumber: { type: Number, required: true },
    text: { type: String }, // made optional to support drawing only annotations
    position: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    color: { type: String, default: "#FFFF00" },
    notes: { type: String, default: "" },
    tags: { type: [String], default: [] },

    // New fields for drawing annotations
    type: {
      type: String,
      enum: ["text", "freehand", "arrow", "shape"],
      required: true,
    },
    drawingData: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const Highlight = mongoose.model("Highlight", highlightSchema);

export default Highlight;
