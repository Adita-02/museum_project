import express from "express";
import Stat from "../models/africa/Stat.js";
import Kingdom from "../models/africa/Kingdom.js";
import Expedition from "../models/africa/Expedition.js";
import AtlasItem from "../models/africa/AtlasItem.js";
import MuseumItem from "../models/africa/MuseumItem.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

const models = {
  stats: Stat,
  kingdoms: Kingdom,
  expeditions: Expedition,
  atlas: AtlasItem,
  museum: MuseumItem,
};

router.get("/", async (req, res) => {
  try {
    const [stats, kingdoms, expeditions, atlasItems, museum] = await Promise.all([
      Stat.find(), Kingdom.find(), Expedition.find(), AtlasItem.find(), MuseumItem.find(),
    ]);
    const tag = (arr, type) => arr.map(d => ({ ...d.toObject(), _type: type }));
    const atlasLargeRaw = atlasItems.find(a => a.size === "large");
    const atlasSmallRaw = atlasItems.filter(a => a.size === "small");

    res.json({
      stats: tag(stats, "stats"),
      kingdoms: tag(kingdoms, "kingdoms"),
      expeditions: tag(expeditions, "expeditions"),
      atlasLarge: atlasLargeRaw ? { ...atlasLargeRaw.toObject(), _type: "atlas" } : null,
      atlasSmall: tag(atlasSmallRaw, "atlas"),
      museum: tag(museum, "museum"),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:type", async (req, res) => {
  const Model = models[req.params.type];
  if (!Model) return res.status(400).json({ message: "Invalid type" });
  try {
    const items = await Model.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:type", verifyAdmin, async (req, res) => {
  const Model = models[req.params.type];
  if (!Model) return res.status(400).json({ message: "Invalid type" });
  try {
    const item = await Model.create(req.body);
    res.status(201).json({ ...item.toObject(), _type: req.params.type });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:type/:id", verifyAdmin, async (req, res) => {
  const Model = models[req.params.type];
  if (!Model) return res.status(400).json({ message: "Invalid type" });
  try {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ ...item.toObject(), _type: req.params.type });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:type/:id", verifyAdmin, async (req, res) => {
  const Model = models[req.params.type];
  if (!Model) return res.status(400).json({ message: "Invalid type" });
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:type/:id/:field", async (req, res) => {
  const { type, id, field } = req.params;
  const Model = models[type];
  if (!Model) return res.status(400).json({ message: "Invalid type" });
  if (!["react", "share"].includes(field)) return res.status(400).json({ message: "Invalid field" });
  try {
    const doc = await Model.findByIdAndUpdate(id, { $inc: { [field]: 1 } }, { new: true });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ...doc.toObject(), _type: type });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:type/:id/comments", async (req, res) => {
  const { type, id } = req.params;
  const { name, text } = req.body;
  const Model = models[type];
  if (!Model) return res.status(400).json({ message: "Invalid type" });
  if (!text || !text.trim()) return res.status(400).json({ message: "Comment text is required" });
  try {
    const doc = await Model.findByIdAndUpdate(
      id,
      { $push: { comments: { name: name?.trim() || "Anonymous", text: text.trim() } } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ...doc.toObject(), _type: type });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/africa/:type/:id/comments/:commentId  → admin panel theke ekta comment delete korbe
router.delete("/:type/:id/comments/:commentId", verifyAdmin, async (req, res) => {
  const { type, id, commentId } = req.params;
  const Model = models[type];
  if (!Model) return res.status(400).json({ message: "Invalid type" });
  try {
    const doc = await Model.findByIdAndUpdate(
      id,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ...doc.toObject(), _type: type });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;