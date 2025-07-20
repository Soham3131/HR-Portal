// config/db.js
// Handles MongoDB connection

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB cluster
        // The connection string should be in your .env file for security
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        // Log any errors during connection and exit the process
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
