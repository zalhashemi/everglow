const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String },
  phone: { type: String }
});

const BusinessSchema = new mongoose.Schema(
  {
    // Account Info
    ownerFirstName: { type: String, required: true },
    ownerLastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },

    // Business Info
    businessName: { type: String, required: true },
    businessType: { type: String, required: true }, // Salon, Barber, Spa, etc.
    address: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String },

    // Operating Hours
    operatingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String
    },

    // Staff List (Embedded)
    staff: [StaffSchema],

    // Social Links (Embedded Object)
    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
      other: String
    },

    // Services (Referenced)
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
