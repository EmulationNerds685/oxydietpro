import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // 1. Import dotenv
import dietRoutes from "./routes/dietRoutes.js";

// 2. Load environment variables
dotenv.config();

const app = express();

// 3. Configure CORS with your .env variable
const corsOptions = {
  origin: process.env.FRONTEND_URL, 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// 🔹 Routes
app.use("/api/diet", dietRoutes);

// 🔹 Health Check Route
app.get("/", (req, res) => {
  res.send("OXYGEN GYM Diet Generator API Running 🚀");
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});