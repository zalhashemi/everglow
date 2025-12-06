const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    role: { type: String, default: "" },
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
      enum: ["points"], 
      default: "points",
    },
    pointsPerBooking: {
      type: Number,
      default: 1, 
      min: 0,
    },
    rewardThreshold: {
      type: Number,
      default: 5, 
      min: 1,
    },
    rewardDescription: {
      type: String,
      default: "",
    },
    expiryMonths: {
      type: Number,
      default: 0, 
      min: 0,
    },
    rewards: [
      {
        type: String, 
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

businessSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Business", businessSchema);