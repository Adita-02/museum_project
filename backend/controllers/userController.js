import User from "../models/User.js"; // apnar model file er path check kore niyen

// GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // req.user ei muhurte JWT theke decoded token — id field ta check korun
    // (jokhon token generate hoy, oi field er naam ja rakha hoyeche shei onujayi)
    if (req.user.id === id || req.user._id === id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};