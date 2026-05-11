const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: false,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
      index: "text",
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      index: "text",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Books",
        "Electronics",
        "Vehicles",
        "Furniture",
        "Food & Kitchen",
        "Services",
        "Events",
        "Room & PG",
        "Rides",
        "Lost & Found",
        "Miscellaneous",
      ],
    },
    subCategory: {
      type: String,
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Used", "For Parts"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isPriceNegotiable: {
      type: Boolean,
      required: true,
      default: true,
    },
    images: {
      type: [String],
      required: true,
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    tags: {
      type: [String],
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "active", "pending", "sold", "expired", "deleted"],
      default: "active",
    },
    viewCount: {
      type: Number,
      required: true,
      default: 0,
    },
    savedCount: {
      type: Number,
      required: true,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

listingSchema.index({ 
  title: "text", 
  description: "text", 
  tags: "text", 
  category: "text" 
}, {
  weights: {
    title: 10,
    tags: 5,
    category: 3,
    description: 1
  },
  name: "ListingTextIndex"
});

function arrayLimit(val) {
  return val.length > 0 && val.length <= 10;
}

listingSchema.pre("validate", async function () {
  if (!this.expiresAt) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 60);
    this.expiresAt = expires;
  }
});

module.exports = mongoose.model("Listing", listingSchema);
