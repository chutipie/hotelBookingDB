const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path as needed

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/yourDatabaseName'); // Replace with your DB name

  const existingAdmin = await User.findOne({ email: 'admin@example.com' });

  if (existingAdmin) {
    console.log('Admin account already exists:', existingAdmin);
  } else {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',  // Use email instead of username
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin account created:', admin);
  }

  mongoose.connection.close();
}

createAdmin();
