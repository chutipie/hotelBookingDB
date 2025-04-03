const mongoose = require("mongoose");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/apdev-phase2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Find the admin user
User.findOne({ role: "admin" })
  .then((admin) => {
    console.log("Admin Account:", admin);
    mongoose.connection.close();
  })
  .catch((err) => console.error(err));
