const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: false,
    },
    department: {
      type: String,
    },
    yearOfStudy: {
      type: Number,
      min: 1,
      max: 6,
    },
    hostel: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    preferences: {
      pushNotifications: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
      marketingOffers: { type: Boolean, default: false },
      contactVisibility: { type: String, enum: ["verified", "anyone"], default: "verified" },
    },
    role: {
      type: String,
      enum: ["student", "college_admin", "super_admin"],
      required: true,
      default: "student",
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    trustScore: {
      type: Number,
      required: true,
      default: 0,
    },
    avgRating: {
      type: Number,
      required: true,
      default: 0,
    },
    ratingCount: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    lastSeen: {
      type: Date,
    },
  },
  { timestamps: true },
);

const bcrypt = require("bcrypt");

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
