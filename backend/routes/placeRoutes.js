import express from "express";
import Place from "../models/place.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json(place);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/:field", async (req, res) => {
  const allowedFields = ["react", "share"];
  const { id, field } = req.params;
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: "Invalid field" });
  }
  try {
    const place = await Place.findByIdAndUpdate(id, { $inc: { [field]: 1 } }, { new: true });
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/comments", async (req, res) => {
  const { name, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Comment text is required" });
  }
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { name: name?.trim() || "Anonymous", text: text.trim() } } },
      { new: true }
    );
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/places/:id/comments/:commentId  → admin panel theke ekta comment delete korbe
router.delete("/:id/comments/:commentId", verifyAdmin, async (req, res) => {
  const { id, commentId } = req.params;
  try {
    const place = await Place.findByIdAndUpdate(
      id,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;