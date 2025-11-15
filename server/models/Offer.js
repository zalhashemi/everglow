const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },

    title: { type: String, required: true },

    servicesAppliedOn: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Service" }
    ],

    discountPercent: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },

    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", OfferSchema);
