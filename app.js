require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const setupSwagger = require('./configuration/swagger');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware')
const userRoutes = require('./routes/userRoutes');
const clubRoutes = require('./routes/clubRoutes');
const bankRoutes = require('./routes/bankRoutes');
const quizRoutes = require('./routes/quizRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const app = express();

// Middleware to parse JSON

app.set('view engine', 'ejs')
app.use(express.json());
// Allows method override via query parameter `_method`
app.use(express.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(chalk.green.bold(`✅ Connected to MongoDB at ${chalk.blue.underline(process.env.MONGO_URI)}`)))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
// Routes
;
app.use('/api', userRoutes);
app.use('/api', clubRoutes);
app.use('/api', bankRoutes);
app.use('/api', eventRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api', transactionRoutes);


setupSwagger(app)
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(chalk.green.bold(`🚀 Server is running on port ${chalk.blueBright.bold(PORT)}`));
});