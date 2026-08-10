import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
}, { timestamps: true });

const atlasSchema = new mongoose.Schema({
  title: String,
  desc: String,
  img: String,
  icon: String,
  size: { type: String, enum: ["large", "small"], required: true }, 
  details: { type: Map, of: String },
  react: { type: Number, default: 0 },
  share: { type: Number, default: 0 },
  comments: [commentSchema],
});
export default mongoose.model("AtlasItem", atlasSchema);