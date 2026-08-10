import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    page: { type: String, default: "europe" },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    topic: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ["pending", "reviewed", "added"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Suggestion", suggestionSchema);