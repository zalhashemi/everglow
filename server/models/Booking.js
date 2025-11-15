const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },

    startTime: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending"
    },

    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
