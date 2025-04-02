const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // For hashing passwords
const User = require("./models/User"); // Import the User model
const Room = require("./models/Rooms"); // Import the Room model
const Booking = require("./models/Booking");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/main/uploads"); // Save uploaded files to this directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Route to handle room creation with multiple images
app.post("/api/rooms", upload.array("room-images", 5), async (req, res) => {
  const type = req.body["room-type"];
  const name = req.body["room-name"];
  const description = req.body["room-description"];
  const inclusions = req.body["room-inclusions"];

  // Split inclusions into an array
  const inclusionsArray = inclusions
    ? inclusions.split(",").map((item) => item.trim())
    : [];

  // Get uploaded image paths
  const images = req.files
    ? req.files.map((file) => `main/uploads/${file.filename}`)
    : [];

  // Validate required fields
  if (!type || !name || !description || images.length === 0) {
    return res.status(400).json({
      error: "Type, Name, Description, and at least one image are required",
    });
  }

  try {
    const newRoom = new Room({
      type,
      name,
      images, // Save multiple image paths
      description,
      inclusions: inclusionsArray,
    });

    await newRoom.save();
    res.status(201).json({ message: "Room added successfully!" });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Failed to add room" });
  }
});

// Route to update a room
app.put("/api/rooms/:id", upload.array("room-images", 5), async (req, res) => {
  const roomId = req.params.id;
  const type = req.body["room-type"];
  const name = req.body["room-name"];
  const description = req.body["room-description"];
  const inclusions = req.body["room-inclusions"];

  // Split inclusions into an array
  const inclusionsArray = inclusions
    ? inclusions.split(",").map((item) => item.trim())
    : [];

  // Get uploaded image paths (if any new images are uploaded)
  const newImages = req.files
    ? req.files.map((file) => `main/uploads/${file.filename}`)
    : [];

  try {
    // Find the room by ID
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Update room details
    room.type = type;
    room.name = name;
    room.description = description;
    room.inclusions = inclusionsArray;

    // Add new images to the existing images array
    room.images = [...room.images, ...newImages];

    // Save the updated room
    await room.save();
    res.status(200).json({ message: "Room updated successfully!" });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
});

// Route to delete a room
app.delete("/api/rooms/:id", async (req, res) => {
  const roomId = req.params.id;

  try {
    // Find the room by ID and delete it
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully!" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

// Route to remove an image from a room
app.delete("/api/rooms/:id/images", async (req, res) => {
  const roomId = req.params.id;
  const { imagePath } = req.body; // Image path to remove

  try {
    // Find the room by ID
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Remove the image from the images array
    room.images = room.images.filter((image) => image !== imagePath);

    // Save the updated room
    await room.save();
    res.status(200).json({ message: "Image removed successfully!" });
  } catch (error) {
    console.error("Error removing image:", error);
    res.status(500).json({ error: "Failed to remove image" });
  }
});

// API endpoint to fetch room data
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find(); // Fetch all rooms from the database
    res.status(200).json(rooms); // Send the rooms as a JSON response
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for sign-up form submission
app.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Validate that the password and email are not empty
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName: first_name,
      lastName: last_name,
      email: email,
      password: hashedPassword,
      role: 'user'
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for login form submission
app.post("/login", async (req, res) => {
  console.log("Login route hit with email:", req.body.email);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Entered password:", password);
    console.log("Stored password hash:", user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      role: user.role,
    });
  } catch (err) {
    console.error("Error in login route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle booking submissions
app.post("/api/bookings", async (req, res) => {
  const {
    room_type,
    checkin_date,
    checkout_date,
    guests,
    nights,
    first_name,
    last_name,
    email,
    phone,
    payment_method,
    special_requests,
  } = req.body;

  try {
    const newBooking = new Booking({
      roomType: room_type,
      checkinDate: new Date(checkin_date),
      checkoutDate: new Date(checkout_date),
      guests: parseInt(guests),
      nights: parseInt(nights),
      firstName: first_name,
      lastName: last_name,
      email,
      phone,
      paymentMethod: payment_method,
      specialRequests: special_requests,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking completed successfully!" });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

app.put("/api/bookings/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedData = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updatedData, { new: true });
    
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Error fetching booking", error });
  }
});

// Route to fetch all bookings for the admin
app.get("/api/bookings", async (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query; // Default: page 1, 5 bookings per page

  try {
    // Build the search query
    const searchQuery = {
      $or: [
        { firstName: { $regex: search, $options: "i" } }, // Case-insensitive search by first name
        { lastName: { $regex: search, $options: "i" } }, // Case-insensitive search by last name
        { email: { $regex: search, $options: "i" } }, // Case-insensitive search by email
      ],
    };

    // Fetch paginated bookings
    const bookings = await Booking.find(searchQuery)
      .skip((page - 1) * limit) // Skip records for pagination
      .limit(parseInt(limit)); // Limit the number of records per page

    // Get the total count of bookings for pagination
    const totalBookings = await Booking.countDocuments(searchQuery);

    // Send the response in the correct format
    res.status(200).json({
      bookings, // Array of bookings
      totalPages: Math.ceil(totalBookings / limit), // Total number of pages
      currentPage: parseInt(page), // Current page number
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// server.js
app.get("/admin-bookings", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main/admin_bookings.html"));
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main/checkout.html"));
});

// Serve login.html
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main/login.html"));
});

// Serve home.html
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main/home.html"));
});

// Serve signup.html
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main/signup.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main/admin_home.html"));
});

app.get("/room-management", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main/room_management.html"));
});

app.get("/amenities-management", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main/admin_home.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
