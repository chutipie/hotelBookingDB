const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Room = require("./models/Rooms");
const Booking = require("./models/Booking");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});

    console.log("Old data cleared.");

    // Insert Users
    const users = await User.insertMany([
      { firstName: "Alice", lastName: "Smith", email: "alice@example.com", password: await bcrypt.hash("password123", 10) },
      { firstName: "Bob", lastName: "Brown", email: "bob@example.com", password: await bcrypt.hash("password123", 10) },
      { firstName: "Charlie", lastName: "Davis", email: "charlie@example.com", password: await bcrypt.hash("password123", 10) },
      { firstName: "Diana", lastName: "Evans", email: "diana@example.com", password: await bcrypt.hash("password123", 10) },
      { firstName: "Ethan", lastName: "Foster", email: "ethan@example.com", password: await bcrypt.hash("password123", 10) }
    ]);

    console.log("Users seeded.");

    // Insert Rooms
    const rooms = await Room.insertMany([
      { type: "Single", name: "Cozy Single Room", images: [], description: "A cozy single room", inclusions: ["WiFi", "TV", "Breakfast"] },
      { type: "Double", name: "Luxury Double Room", images: [], description: "Spacious double room", inclusions: ["WiFi", "TV", "Pool Access"] },
      { type: "Suite", name: "Executive Suite", images: [], description: "Luxury suite with sea view", inclusions: ["WiFi", "TV", "Mini Bar"] },
      { type: "Family", name: "Family Room", images: [], description: "Perfect for families", inclusions: ["WiFi", "TV", "Play Area"] },
      { type: "Penthouse", name: "Penthouse Suite", images: [], description: "Ultimate luxury", inclusions: ["WiFi", "TV", "Jacuzzi"] }
    ]);

    console.log("Rooms seeded.");

    // Insert Bookings
    await Booking.insertMany([
      { roomType: "Single", checkinDate: new Date(), checkoutDate: new Date(), guests: 1, nights: 2, firstName: "Alice", lastName: "Smith", email: "alice@example.com", phone: "1234567890", paymentMethod: "Credit Card" },
      { roomType: "Double", checkinDate: new Date(), checkoutDate: new Date(), guests: 2, nights: 3, firstName: "Bob", lastName: "Brown", email: "bob@example.com", phone: "1234567891", paymentMethod: "PayPal" },
      { roomType: "Suite", checkinDate: new Date(), checkoutDate: new Date(), guests: 2, nights: 5, firstName: "Charlie", lastName: "Davis", email: "charlie@example.com", phone: "1234567892", paymentMethod: "Bank Transfer" },
      { roomType: "Family", checkinDate: new Date(), checkoutDate: new Date(), guests: 4, nights: 4, firstName: "Diana", lastName: "Evans", email: "diana@example.com", phone: "1234567893", paymentMethod: "Credit Card" },
      { roomType: "Penthouse", checkinDate: new Date(), checkoutDate: new Date(), guests: 2, nights: 2, firstName: "Ethan", lastName: "Foster", email: "ethan@example.com", phone: "1234567894", paymentMethod: "PayPal" }
    ]);

    console.log("Bookings seeded.");

    mongoose.connection.close();
    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
};

// Execute the seed function
seedDatabase();
