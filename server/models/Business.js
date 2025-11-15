const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  email: String,
  phone: String
});

const BusinessSchema = new mongoose.Schema(
  {
    ownerFirstName: { type: String, required: true },
    ownerLastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: String,

    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    description: String,

    operatingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String
    },

    staff: [StaffSchema],

    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
      other: String
    },

    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
