import Review from "../models/Review.js";

// GET /api/reviews  → sob region er sob review (admin panel er jonno)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reviews/:region  → shob review niye ashbe (americas/europe)
export const getReviews = async (req, res) => {
  try {
    const { region } = req.params;
    const reviews = await Review.find({ region }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/reviews/:region  → notun review add korbe
export const addReview = async (req, res) => {
  try {
    const { region } = req.params;
    const { name, era, rating, body } = req.body;
    if (!name || !era || !rating || !body) {
      return res.status(400).json({ message: "Shob field lagbe" });
    }
    const review = await Review.create({ region, name, era, rating, body });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/reviews/:id/helpful  → helpful count barabe
export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};