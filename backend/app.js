const express = require("express");
const cors = require("cors");
require("dotenv").config();

const vehicleRoutes = require("./routes/vehicleRoutes");
const userRoutes = require("./routes/userRoutes");

const { handleError } = require("./utils/errorHandler"); // Import centralized error handler

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/vehicles", vehicleRoutes);
app.use("/users", userRoutes);

// Root endpoint (optional, returns JSON)
app.get("/", (req, res) => {
  res.json({ message: "Vehicle Management API" });
});

// 404 handler — respond with JSON
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler — use centralized handleError function
app.use((err, req, res, next) => {
  // Use centralized error handler to send response
  handleError(res, err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
