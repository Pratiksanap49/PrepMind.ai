import express from "express";
import protect from "../middleware/protect.js";
import {
    createSession,
    submitAnswers,
    getHistory,
    getSessionDetails,
} from "../controllers/sessionController.js";

const router = express.Router();

// All session routes are protected
router.use(protect);

router.post("/create", createSession);
router.post("/:id/submit", submitAnswers);
router.get("/history", getHistory);
router.get("/:id", getSessionDetails);

export default router;
