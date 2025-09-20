// // server.js
// // Main entry point for the backend application

// const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();
// const cors = require('cors');
// const connectDB = require('./config/db');



// // Initialize Express app
// const app = express();

// // Connect to MongoDB database
// connectDB();

// // Middleware
// // Enable Cross-Origin Resource Sharing (CORS)
// app.use(cors());
// // Enable express to parse JSON bodies in requests
// app.use(express.json());

// // A simple root route to test if the server is running
// app.get('/', (req, res) => {
//     res.send('AVANI ENTERPRISES HR Portal API is running...');
// });


// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/employee', require('./routes/employeeRoutes'));
// app.use('/api/hr', require('./routes/hrRoutes'));


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// server.js
// Main entry point for the backend application

const express = require('express');
// --- FIX: Load environment variables at the very top ---
const dotenv = require('dotenv');
dotenv.config(); // This ensures process.env is populated before any other file is loaded

const cors = require('cors');
const connectDB = require('./config/db');

// Now, we can import our routes, which depend on the environment variables
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const hrRoutes = require('./routes/hrRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

// A simple root route to test if the server is running
app.get('/', (req, res) => {
    res.send('AVANI ENTERPRISES HR Portal API is running...');
});

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/hr', hrRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
