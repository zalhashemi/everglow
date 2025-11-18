const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  fullName: { type: String },          // ⬅ remove required: true
  role: { type: String },
  email: { type: String },
  phone: { type: String },
});

const businessSchema = new mongoose.Schema({
  ownerFirstName: { type: String },    // ⬅ remove required: true
  ownerLastName: { type: String },     // ⬅ remove required: true
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },      // ⬅ remove required: true
  phone: { type: String },

  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String },

  operatingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
  },

  staff: [staffSchema],

  socialLinks: {
    instagram: String,
    facebook: String,
    website: String,
    other: String,
  },

  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
