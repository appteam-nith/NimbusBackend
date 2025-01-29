require('dotenv').config();
const express = require('express');
const setupSwagger = require('./configuration/swagger');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware')
const userRoutes = require('./routes/userRoutes');
const clubRoutes = require('./routes/clubRoutes');
const bankRoutes = require('./routes/bankRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
// Routes
;
app.use('/api', userRoutes);
app.use('/api', clubRoutes);
app.use('/api', bankRoutes);
app.use('/api', transactionRoutes);


setupSwagger(app);
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

