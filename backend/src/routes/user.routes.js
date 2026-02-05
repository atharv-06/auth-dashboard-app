const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @route   GET /api/v1/me
 * @desc    Get logged-in user profile
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/**
 * @route   PUT /api/v1/me
 * @desc    Update user profile
 */
router.put("/", auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Allow only safe fields to be updated
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase();

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }

    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
