const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

conversationSchema.pre("validate", async function () {
  if (this.participants.length !== 2) {
    throw new Error("A conversation must have exactly two participants.");
  }
});

conversationSchema.index({ listingId: 1, participants: 1 });
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
