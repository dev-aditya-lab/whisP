import express from "express";
import { reportUser } from "../controllers/report.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", verifyJWT, reportUser);

export default router;
