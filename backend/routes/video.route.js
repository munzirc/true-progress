import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import videoController from "../controllers/video.controller.js";

const router = express.Router();

router.post("/add", protect, videoController.addVideo);
router.delete("/:videoId", protect, videoController.removeVideo);
router.get("", protect, videoController.getAllVideos);

export default router;
