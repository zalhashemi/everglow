const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    priceBHD: { type: Number, required: true },
    category: String,
    description: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
