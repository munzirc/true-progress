import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.get("/check", authController.authCheck);

export default router;
