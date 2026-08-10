// routes/civilizationRoutes.js
import express from "express";
import {
  getAllCivilizations,
  getCivilizations,
  createCivilization,
  updateCivilization,
  deleteCivilization,
} from "../controllers/civilizationController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/civilizations", getAllCivilizations);
router.get("/civilizations/:continent", getCivilizations);
router.post("/civilizations", verifyAdmin, createCivilization);
router.put("/civilizations/:id", verifyAdmin, updateCivilization);
router.delete("/civilizations/:id", verifyAdmin, deleteCivilization);

export default router;