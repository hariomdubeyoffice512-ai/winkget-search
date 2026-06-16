const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '✅ Winkget API is running!' });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});