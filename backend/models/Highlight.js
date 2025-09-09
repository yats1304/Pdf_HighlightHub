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
    text: { type: String, required: true },
    position: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    color: { type: String, default: "#FFFF00" }, // Yellow
  },
  {
    timestamps: true,
  }
);

const Highlight = mongoose.model("Highlight", highlightSchema);

export default Highlight;
