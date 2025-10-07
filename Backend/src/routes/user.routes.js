import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/profile", verifyJWT, getUserProfile);
router.put("/profileUpdate", verifyJWT, updateUserProfile);

export default router;
