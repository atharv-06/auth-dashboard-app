const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* =====================
   GET PROFILE
   GET /api/v1/me
===================== */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: user,
    });

  } catch (error) {
    next(error);
  }
};

/* =====================
   UPDATE PROFILE
   PUT /api/v1/me
===================== */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (error) {
    next(error);
  }
};
