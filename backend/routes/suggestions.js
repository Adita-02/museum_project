import express from "express";
import Suggestion from "../models/Suggestion.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { page = "europe" } = req.query;
    const suggestions = await Suggestion.find({ page }).sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { page, name, email, topic, description } = req.body;
    if (!name || !topic) {
      return res.status(400).json({ message: "Name and topic are required" });
    }
    const suggestion = await Suggestion.create({ page, name, email, topic, description });
    res.status(201).json(suggestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;