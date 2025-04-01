// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomType: { type: String, required: true },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  nights: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  specialRequests: { type: String },
});

module.exports = mongoose.model("Booking", bookingSchema);