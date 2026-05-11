const User = require("./user.model");
const bcrypt = require("bcrypt");
const cloudinary = require("../../utils/cloudinary");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "shelf_avatars" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, department, yearOfStudy, hostel, whatsapp } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (department) updateData.department = department;
    if (yearOfStudy) updateData.yearOfStudy = Number(yearOfStudy);
    if (hostel) updateData.hostel = hostel;
    if (whatsapp) updateData.whatsapp = whatsapp;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.avatarUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { pushNotifications, emailAlerts, marketingOffers, contactVisibility } = req.body;
    
    
    const updateObj = {};
    if (pushNotifications !== undefined) updateObj["preferences.pushNotifications"] = pushNotifications;
    if (emailAlerts !== undefined) updateObj["preferences.emailAlerts"] = emailAlerts;
    if (marketingOffers !== undefined) updateObj["preferences.marketingOffers"] = marketingOffers;
    if (contactVisibility !== undefined) updateObj["preferences.contactVisibility"] = contactVisibility;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateObj },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect current password" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWhatsapp = async (req, res) => {
  try {
    const { whatsapp } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { whatsapp },
      { new: true }
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isActive: false },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Account deactivated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
