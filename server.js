const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database');
});

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ message: 'Error creating user' });
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Endpoint (Fixed Async Issue)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch All Rooms
app.get('/rooms', (req, res) => {
  db.query('SELECT * FROM rooms', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching rooms' });
    res.json(results);
  });
});

// Add a New Room
app.post('/rooms', upload.single('image'), (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file ? req.file.path : null;
  db.query('INSERT INTO rooms (name, price, description, image) VALUES (?, ?, ?, ?)',
    [name, price, description, image],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error adding room' });
      res.status(201).json({ message: 'Room added successfully' });
    }
  );
});

// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});