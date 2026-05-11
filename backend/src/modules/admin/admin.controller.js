const Listing = require("../listings/listing.model");
const User = require("../users/user.model");

exports.getStats = async (req, res) => {
  try {
    const listingCount = await Listing.countDocuments();
    const userCount = await User.countDocuments();
    const reportCount = 0; 
    const collegeCount = 1;

    res.status(200).json({
      success: true,
      data: { listings: listingCount, users: userCount, reports: reportCount, colleges: collegeCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
