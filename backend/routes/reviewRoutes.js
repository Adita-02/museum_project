import express from "express";
import {
  getReviews,
  getAllReviews,
  addReview,
  markHelpful,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:region", getReviews);
router.post("/:region", addReview);
router.patch("/:id/helpful", markHelpful);

export default router;