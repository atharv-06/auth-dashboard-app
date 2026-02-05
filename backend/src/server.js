const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

/* =====================
   Global Middleware
===================== */
app.use(
  cors({
    origin: "*", // restrict this in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* =====================
   API Routes
===================== */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/me", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

/* =====================
   Health Check
===================== */
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/* =====================
   Global Error Handler
===================== */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

/* =====================
   Database + Server
===================== */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    /* Graceful Shutdown */
    process.on("SIGINT", async () => {
      console.log("Shutting down server...");
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
