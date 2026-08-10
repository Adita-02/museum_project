// models/Civilization.js
import mongoose from "mongoose";

const civilizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    era: { type: String },
    period: { type: String },
    region: { type: String },      // অথবা continent — যেটা আপনার আসল ফিল্ড
    img: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Civilization", civilizationSchema);