import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Annotated"],
    default: "Pending",
  },
  thumbnailUrl: {
    type: String,
  },
  sharedWith: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      permission: {
        type: String,
        enum: ["view", "edit"],
        default: "view",
      },
    },
  ],
});

const Pdf = mongoose.model("Pdf", pdfSchema);

export default Pdf;
