import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/task.route";
import authRoutes from "./routes/auth.route";

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS to allow requests from frontend
const allowedOrigins: string[] = process.env.NODE_ENV === 'production' 
  ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
  : [process.env.FRONTEND_URL || "http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : false,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok",
    version: process.env.API_VERSION || "v1",
    environment: process.env.NODE_ENV || "development"
  });
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 14000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
