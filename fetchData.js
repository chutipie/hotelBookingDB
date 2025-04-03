const mongoose = require("mongoose");
const User = require("./models/User");
const Room = require("./models/Rooms");
const Booking = require("./models/Booking");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const fetchData = async () => {
  try {
    const users = await User.find({});
    const rooms = await Room.find({});
    const bookings = await Booking.find({});

    console.log("Users:", users);
    console.log("Rooms:", rooms);
    console.log("Bookings:", bookings);

    mongoose.connection.close();
  } catch (err) {
    console.error("Error fetching data:", err);
    mongoose.connection.close();
  }
};

fetchData();
