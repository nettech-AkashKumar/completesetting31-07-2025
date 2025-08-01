const User = require("../models/usersModels");
const Role = require("../models/roleModels");
const cloudinary = require("../utils/cloudinary/cloudinary");
const bcrypt = require("bcryptjs");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      passwordChangedAt,
      confirmPassword,
      role,
      status,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let profileImage = null;

    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "profile_images" })
      );
      const uploadedImages = await Promise.all(imageUploadPromises);
      profileImage = {
        url: uploadedImages[0].secure_url,
        public_id: uploadedImages[0].public_id,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      passwordChangedAt:new Date(),
      profileImage,
      role,
      status,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      currentpassword,
      newpassword,
      confirmpassword,
      role,
      status,
    } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    //verify current password before making changes
    if (newpassword || confirmpassword) {
      if (!currentpassword) {
        return res.status(404).json({
          message: "Current password is required to change the password",
        });
      }
      const isMatch = await bcrypt.compare(currentpassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      if (newpassword !== confirmpassword) {
        return res.status(404).json({ message: "New passwords do not match" });
      }
      user.password = await bcrypt.hash(newpassword, 10);
      user.passwordChangedAt = new Date();
    }

    if (req.file) {
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
      });
      user.profileImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (typeof status !== "undefined") user.status = status;

    // if (password && password.trim() !== "") {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   user.password = hashedPassword;
    // }

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

// GET ACTIVE USERS
exports.getActiveUsers = async (req, res) => {
  try {
    // If using boolean: { status: true }
    // If using string: { status: "Active" }
    const activeUsers = await User.find({ status: "Active" })
      .populate("role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Active users fetched successfully",
      total: activeUsers.length,
      users: activeUsers,
    });
  } catch (error) {
    console.error("Get Active Users Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// for two factor auth
exports.toggleTwoFactor = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();
    return res
      .status(200)
      .json({
        message: `Two-factor authentication ${
          user.twoFactorEnabled ? "enabled" : "disabled"
        } successfully`,
        twoFactorEnabled: user.twoFactorEnabled,
      });
  } catch (error) {
    console.error("Toggle 2FA error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// for acivate and deactivate account
exports.toggleAccountStatus = async (req, res) => {
  const { id } = req.params;
  console.log("Toggle status for user ID:", id);

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.status = user.status ===  "Active" ? "Inactive" : "Active";
    await user.save();
    res.status(200).json({
     status: user.status
    });
  } catch (error) {
    console.error("Toggle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};