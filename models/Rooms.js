// models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // e.g., "single", "double", "suite"
  name: { type: String, required: true }, // e.g., "Single Room", "Double Room"
  images: { type: [String], required: true }, // Array of image paths
  description: { type: String, required: true }, // Description of the room
  inclusions: { type: [String], required: true }, // Array of inclusions (e.g., ["Free Wi-Fi", "Breakfast"])
});

module.exports = mongoose.model("Rooms", roomSchema);