const mongoose = require("mongoose");

const LoyaltySchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      unique: true, 
    },
    enabled: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["points"],
      default: "points",
    },
    pointsPerBooking: {
      type: Number,
      default: 1,
      min: 0,
    },
    rewardThreshold: {
      type: Number,
      default: 5,
      min: 1,
    },
    rewardDescription: {
      type: String,
      default: "",
    },
    expiryMonths: {
      type: Number,
      default: 0,
      min: 0,
    },
    rewards: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Loyalty || mongoose.model("Loyalty", LoyaltySchema);
