const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    role: { type: String, default: "" },
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

// ✅ operatingHours is ONE object with day keys, not an array
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
        type: String, // e.g. "Name::Offer"
      },
    ],
  },
  { _id: false }
);

const businessSchema = new mongoose.Schema(
  {
    ownerFirstName: { type: String },
    ownerLastName: { type: String },
    passwordHash: { type: String },

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
      default: null, 
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], 
      },
    },

    loyalty: {
      type: LoyaltySchema,
      default: () => ({}),
    },
    loyaltyEnabled: {
      type: Boolean,
      default: false,
    },

    genderTag: {
      type: String,
      enum: ["women", "men", "mixed"],
      default: "mixed",
    },
  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries
businessSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Business", businessSchema);
