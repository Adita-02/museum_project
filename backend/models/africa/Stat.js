import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
}, { timestamps: true });

const statSchema = new mongoose.Schema({
  stat: String,
  desc: String,
  icon: String,
  details: { type: Map, of: String },
  // react: { type: Number, default: 0 },
  // share: { type: Number, default: 0 },
  // comments: [commentSchema],
});
export default mongoose.model("Stat", statSchema);