const express = require("express");
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} = require("./listing.controller");
const { protect } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

const router = express.Router();

router
  .route("/")
  .get(getListings)
  .post(protect, upload.array("images", 10), createListing);

router
  .route("/:id")
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

module.exports = router;
