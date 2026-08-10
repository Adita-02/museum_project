import mongoose from "mongoose";

const artifactSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: String,
  category: String,
  period: String,
  discoveredBy: String,
  discoveredYear: String,
  housedAt: String,
}, { _id: false });

const commentSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
}, { timestamps: true }); // timestamps দিলে createdAt নিজে থেকেই যোগ হবে

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  country: String,
  cover: String,
  era: String,
  yearStart: Number,
  status: String,
  decline: String,
  description: String,
  culture: [String],
  museum: String,
  artifacts: String,
  react: { type: Number, default: 0 },
  share: { type: Number, default: 0 },
  comments: [commentSchema],   // ← নতুন
  artifactList: [artifactSchema],
}, { timestamps: true });

export default mongoose.model("Place", placeSchema);