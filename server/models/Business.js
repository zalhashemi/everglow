const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    role: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const socialLinksSchema = new mongoose.Schema(
  {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    website: { type: String, default: "" },
    other: { type: String, default: "" },
  },
  { _id: false }
);

const operatingHoursSchema = new mongoose.Schema(
  {
    monday: { type: String, default: "" },
    tuesday: { type: String, default: "" },
    wednesday: { type: String, default: "" },
    thursday: { type: String, default: "" },
    friday: { type: String, default: "" },
    saturday: { type: String, default: "" },
    sunday: { type: String, default: "" },
  },
  { _id: false }
);

const businessSchema = new mongoose.Schema(
  {
    // Old auth-style flow fields
    ownerFirstName: { type: String },
    ownerLastName: { type: String },
    passwordHash: { type: String },

    // Common fields
    email: { type: String, required: true, unique: true },
    phone: { type: String },

    businessName: { type: String, required: true },
    businessType: { type: String, required: true },

    address: { type: String, required: true },
    city: { type: String, required: true },

    description: { type: String, default: "" },

    operatingHours: { type: operatingHoursSchema, default: () => ({}) },

    staff: { type: [staffSchema], default: [] },

    socialLinks: { type: socialLinksSchema, default: () => ({}) },

    imageUrl: {
      type: String,
      default: null, // e.g. "/uploads/filename.jpg"
    },

    // ❌ services array removed – services live in their own collection
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
