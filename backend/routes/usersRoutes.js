const express = require("express");
const router = express.Router();
const upload = require("../config/upload.js");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getActiveUsers,
  toggleTwoFactor,
  toggleAccountStatus
} = require("../controllers/usersController");

const { authMiddleware } = require("../middleware/auth");
// Create user (with image upload)
router.post("/add", upload.array("profileImage"), createUser);

// Get all users
router.get("/getuser", getAllUsers);

// Get a specific user
// router.get("/user/:id", getUserById);
router.get("/:id", getUserById);

// Update user (with optional image upload)
router.put("/update/:id", upload.single("profileImage"), updateUser);

// Delete user
router.delete("/userDelete/:id", deleteUser);
router.get("/status/active", getActiveUsers);
// router.get("/profile", authMiddleware, getMyProfile);

// two factor
router.put("/toggle-2fa/:id", toggleTwoFactor);
// for activate and deactivate account
router.put("/toggle-status/:id", toggleAccountStatus);

module.exports = router;
