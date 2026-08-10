import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
}, { timestamps: true });

const expeditionSchema = new mongoose.Schema({
  title: String,
  icon: String,
  desc: String,
  details: { type: Map, of: String },
  // react: { type: Number, default: 0 },
  // share: { type: Number, default: 0 },
  // comments: [commentSchema],
});
export default mongoose.model("Expedition", expeditionSchema);