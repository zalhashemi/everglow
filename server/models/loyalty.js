// server/models/Loyalty.js
const mongoose = require("mongoose");

const LoyaltySchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      unique: true, // one loyalty config per business
    },
    enabled: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["points"],
      default: "points",
    },
    pointsPerBooking: {
      type: Number,
      default: 1, // 1 point per completed booking
      min: 0,
    },
    rewardThreshold: {
      type: Number,
      default: 5, // 5 points = full tile
      min: 1,
    },
    rewardDescription: {
      type: String,
      default: "",
    },
    expiryMonths: {
      type: Number,
      default: 0, // 0 = never expires
      min: 0,
    },
    // we store "name::offer" strings here (e.g. "Glow-up Blow-dry::20% off")
    rewards: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loyalty", LoyaltySchema);
