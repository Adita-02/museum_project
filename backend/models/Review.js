import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    region: { type: String, required: true }, // "americas" or "europe" — kon page er review ta
    name: { type: String, required: true },
    era: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    body: { type: String, required: true },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true } // createdAt automatic pabe, date hishebe use korbo
);

export default mongoose.model("Review", reviewSchema);