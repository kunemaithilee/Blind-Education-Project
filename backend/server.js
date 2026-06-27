const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, isDbConnected } = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const progressRoutes = require("./routes/progressRoutes");
const aiRoutes = require("./routes/aiRoutes");
const ocrRoutes = require("./routes/ocrRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "EchoLearn API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    api: "running",
    database: isDbConnected() ? "connected" : "fallback-demo-mode",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", authMiddleware, progressRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ocr", ocrRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorMiddleware);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`EchoLearn backend running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
