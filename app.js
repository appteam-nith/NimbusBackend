require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const setupSwagger = require("./configuration/swagger");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");
const clubRoutes = require("./routes/clubRoutes");
const bankRoutes = require("./routes/bankRoutes");
const quizRoutes = require("./routes/quizRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const eventRoutes = require("./routes/eventRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log(
      chalk.green.bold(
        `✅ Connected to MongoDB at ${chalk.blue.underline(process.env.MONGO_URI)}`
      )
    )
  )
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/api", userRoutes);
app.use("/api", clubRoutes);
app.use("/api", bankRoutes);
app.use("/api", eventRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api", transactionRoutes);
app.use("/api", taskRoutes);
app.use("/api", projectRoutes);

setupSwagger(app);

module.exports = app; 
