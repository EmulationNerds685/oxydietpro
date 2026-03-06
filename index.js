import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dietRoutes from "./routes/dietRoutes.js";

dotenv.config();

const app = express();

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// 🔹 Routes
app.use("/api/diet", dietRoutes);

// 🔹 Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "OXYGEN GYM Diet Generator API Running 🚀",
  });
});

// 🔹 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});