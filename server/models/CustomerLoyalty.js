const mongoose = require("mongoose");

const CustomerLoyaltySchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    points: { type: Number, default: 0, min: 0, max: 5 },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerLoyalty", CustomerLoyaltySchema);
