
# MotelEase - Motel Management System

**MotelEase** is a web-based motel management system designed to simplify the process of managing rooms, bookings, and amenities for motel owners. It provides a seamless experience for both administrators and guests, allowing admins to manage rooms and view bookings, while guests can book rooms and view their reservations.

This project is built using **Node.js** for the backend, **MongoDB** for the database, and **HTML/CSS/JavaScript** for the frontend.




## Admin Features
- **Room Management:** Add, update, and delete rooms.
- **Booking Management:** View all bookings with search and pagination.

## Guest Features
- **Room Booking:** Book rooms with check-in and check-out dates.
- **Booking Preview:** View room details and inclusions before booking.
- **Checkout:** Complete the booking process with payment options.



## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend:** HTML, CSS, JavaScript
- **Other Tools:**
   - **Multer:** For handling file uploads (e.g., room images).
   - **Bcrypt:** For password hashing.
   - **Dotenv:** For managing environment variables.
   - **SweetAlert2:** For displaying notifications.


## Prerequisites
Before running the project, ensure you have the following installed:
1. **Node.js:** Download Node.js
2. **MongoDB:** Download MongoDB
3. **Git:** Download Git


## Setup Instructions

1. **Clone the Repository**

```bash
 git clone https://github.com/your-username/motel-ease.git
 cd motel-ease
```
2. **Install Dependencies**
Install the required Node.js packages:
```bash
 npm install
```
3. **Set Up Environment Variables**
Create a .env file in the root directory and add the following variables:
```env
MONGO_URI=mongodb://localhost:27017/motelease
PORT=3000
```
Replace **mongodb://localhost:27017/motelease** with your MongoDB connection string.
4. **Start the MongoDB Server**
Ensure MongoDB is running on your system. If you're using a local MongoDB instance, start it with:
```bash
 mongod
```
5. **Run the Application**
Start the Node.js server:
```bash
 npm start
```
The application will be available at **http://localhost:3000.**

## Project Structure

apdev-phase2/
├── public/                  # Static files (HTML, CSS, JS, images)
│   ├── main/
│   │   ├── login.html       # For exising guests account
│   │   ├── signup.html      # New guests account
│   │   ├── home.html        # Home page for guests
│   │   ├── checkout.html    # Checkout page for bookings
│   │   ├── admin_home.html  # Admin dashboard
│   │   ├── admin_bookings.html # Admin bookings page
│   │   ├── room_management.html # Admin room management page
│   │   ├── uploads/             # Uploaded room images
│   ├── index.html           # Start Page
│   ├── aboutus.html         # About us Page
├── models/                  # MongoDB models
│   ├── Booking.js           # Booking schema
│   ├── Room.js              # Room schema
│   ├── User.js              # User schema
├── server.js                # Main server file
├── .env                     # Environment variables
├── package.json             # Node.js dependencies and scripts
├── README.md                # Project documentation
