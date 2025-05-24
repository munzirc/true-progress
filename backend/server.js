import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.route.js";
import videoRouter from "./routes/video.route.js";

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/video", videoRouter);

app.get("/health", (req, res) => {
  res.send("health OK!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
