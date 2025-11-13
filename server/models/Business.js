const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: String,
    address: String,
    description: String,
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
