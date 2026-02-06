const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const connectDB = require('./db/mongo');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// Global rate limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(apiLimiter);           // <-- add BEFORE your routes
app.use(cors());               // Enable CORS for all origins by default
app.use(express.json());

// Custom logging middleware
app.use(requestLogger);

const port = process.env.PORT || 3000;

// Health check route
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// User-related routes
app.use('/users', userRoutes);

// Transaction-related routes
app.use('/transactions', transactionRoutes);

// Budget-related routes
app.use('/budgets', budgetRoutes);

// Global error-handling middleware (should be last)
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});