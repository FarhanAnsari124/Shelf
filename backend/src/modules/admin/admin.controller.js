const Listing = require("../listings/listing.model");
const User = require("../users/user.model");

exports.getStats = async (req, res) => {
  try {
    const listingCount = await Listing.countDocuments();
    const userCount = await User.countDocuments();
    // Assuming you might add a Report model later, for now we can mock or use a constant
    const reportCount = 0; 
    const collegeCount = 1; // Default for current setup

    res.status(200).json({
      success: true,
      data: {
        listings: listingCount,
        users: userCount,
        reports: reportCount,
        colleges: collegeCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
