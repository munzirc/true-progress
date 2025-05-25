import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import progressController from "../controllers/progress.controller.js";

const router = express.Router();

router.post("/update", protect, progressController.updateProgress);

export default router;
