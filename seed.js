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

    // Seed Admin User
    const adminPassword = await bcrypt.hash("admin123", 10); // Hash the admin password
    await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });

    console.log("Admin user seeded.");

    // Insert Rooms (example)
    await Room.insertMany([
      { type: "Single", name: "Single Room", description: "A simple single room", inclusions: ["Wi-Fi", "Breakfast"], images: ["image1.jpg"] },
      { type: "Double", name: "Double Room", description: "A room with a double bed", inclusions: ["Wi-Fi", "Air Conditioning"], images: ["image2.jpg"] },
      { type: "Suite", name: "Suite Room", description: "A luxurious suite room", inclusions: ["Wi-Fi", "Jacuzzi", "Breakfast"], images: ["image3.jpg"] },
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
