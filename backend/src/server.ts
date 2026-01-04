import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.route";
import authRoutes from "./routes/auth.route";

const app = express();

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  credentials: true
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = 14000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
