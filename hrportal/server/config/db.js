// config/db.js
// Handles MongoDB connection

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB cluster
        // The connection string should be in your .env file for security
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully...');
    } catch (err) {
        // Log any errors during connection and exit the process
        console.error('MongoDB connection error:', err.message);
        if (err.message.includes('querySrv ETIMEOUT')) {
            console.error('Note: This usually means your IP is not whitelisted in MongoDB Atlas or you have a DNS issue.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
