const express = require("express");
const cors = require("cors");
require("dotenv").config();

const vehicleRoutes = require("./routes/vehicleRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/vehicles", vehicleRoutes);

// Mount user routes at /api/users (adjust based on your route definitions)
app.use("/users", userRoutes);

// Root endpoint (optional, return json)
app.get("/", (req, res) => {
  res.json({ message: "Vehicle Management API" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
