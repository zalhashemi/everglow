const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    role: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    // allow per-staff work schedule (we store a generic object)
    schedule: {
      type: Object,
      default: {},
    },
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

const LoyaltySchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["points"], // only points now
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
    rewards: [
      {
        type: String, // e.g. "Free blow-dry"
      },
    ],
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

    // 🌍 Geo location for map / "near me"
    // Only set this when we actually have coordinates
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

    // Loyalty configuration stored on the business document
    loyalty: {
      type: LoyaltySchema,
      default: () => ({}),
    },
    loyaltyEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries
businessSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Business", businessSchema);
