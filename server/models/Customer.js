const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    phone: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
