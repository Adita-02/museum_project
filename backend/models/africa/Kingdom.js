import mongoose from "mongoose";
const subitemSchema = new mongoose.Schema({
  title: String, img: String, info: String,
}, { _id: false });

const commentSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
}, { timestamps: true });

const kingdomSchema = new mongoose.Schema({
  title: String,
  era: String,
  desc: String,
  img: String,
  details: { type: Map, of: String },
  subitems: [subitemSchema],
  react: { type: Number, default: 0 },
  share: { type: Number, default: 0 },
  comments: [commentSchema],
});
export default mongoose.model("Kingdom", kingdomSchema);