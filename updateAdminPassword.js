const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Make sure the path is correct to your User model

// MongoDB connection string
const mongoURI = 'mongodb+srv://matthewandrecorral:c92CnCVhUa8w9A1y@hotelbookingdb.kgsc2nc.mongodb.net/?retryWrites=true&w=majority&appName=hotelBookingDB';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10); // Use the password you want
    await User.updateOne({ email: 'admin@example.com' }, { $set: { password: hashedPassword } });
    console.log('Admin password updated');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));
