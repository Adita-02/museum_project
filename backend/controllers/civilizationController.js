// controllers/civilizationController.js
import Civilization from "../models/Civilization.js";

// GET /api/civilizations  → sob civilization (admin panel er jonno)
export const getAllCivilizations = async (req, res) => {
  try {
    const civs = await Civilization.find().sort({ createdAt: -1 });
    res.json(civs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/civilizations/:continent  → specific continent er civilizations
export const getCivilizations = async (req, res) => {
  try {
    const { continent } = req.params;
    const civs = await Civilization.find({ continent }).sort({ order: 1 });
    res.json(civs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/civilizations  → notun civilization add korbe
export const createCivilization = async (req, res) => {
  try {
    const civ = await Civilization.create(req.body);
    res.status(201).json(civ);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/civilizations/:id  → existing civilization update korbe
export const updateCivilization = async (req, res) => {
  try {
    const { id } = req.params;
    const civ = await Civilization.findByIdAndUpdate(id, req.body, { new: true });
    if (!civ) {
      return res.status(404).json({ message: "Civilization not found" });
    }
    res.json(civ);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/civilizations/:id  → civilization delete korbe
export const deleteCivilization = async (req, res) => {
  try {
    const { id } = req.params;
    const civ = await Civilization.findByIdAndDelete(id);
    if (!civ) {
      return res.status(404).json({ message: "Civilization not found" });
    }
    res.json({ message: "Civilization deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};