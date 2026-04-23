import Session from "../models/Session.js";
import { generateQuestions, evaluateAnswers } from "../services/aiService.js";

/**
 * POST /api/session/create
 * Create a new interview session with AI-generated questions
 */
export const createSession = async (req, res) => {
    try {
        const { role, skills, difficulty, questionCount } = req.body;

        if (!role || !skills || !difficulty || !questionCount) {
            return res.status(400).json({ message: "Please provide role, skills, difficulty, and questionCount" });
        }

        const questionTexts = await generateQuestions(role, skills, difficulty, questionCount);

        const questions = questionTexts.map((text) => ({ questionText: text }));

        const session = await Session.create({
            userId: req.user._id,
            role,
            difficulty,
            status: "in-progress",
        });

        // Questions live only in the API response — not saved to DB
        const questionsWithIds = questions.map((q, i) => ({
            _id: `${session._id}_q${i}`,
            questionText: q.questionText,
        }));

        res.status(201).json({
            sessionId: session._id,
            questions: questionsWithIds,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create session", error: error.message });
    }
};

/**
 * POST /api/session/:id/submit
 * Submit answers and get AI evaluation
 */
export const submitAnswers = async (req, res) => {
    try {
        const { id } = req.params;
        const { questions, answers } = req.body;

        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Please provide questions as an array" });
        }

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: "Please provide answers as an array" });
        }

        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to access this session" });
        }

        if (session.status === "completed") {
            return res.status(400).json({ message: "Session is already completed" });
        }

        const { evaluations, overallScore } = await evaluateAnswers(questions, answers);

        const qaPairs = questions.map((q, index) => {
            // Find corresponding evaluation (it matches index or we can assume sequential)
            // Just matching index based on evaluateAnswers behavior
            return {
                questionText: q.questionText,
                answerText: answers[index].answerText,
                score: evaluations[index].score,
                suggestion: evaluations[index].suggestion,
            };
        });

        session.qaPairs = qaPairs;
        session.overallScore = overallScore;
        session.status = "completed";
        await session.save();

        res.status(200).json({
            overallScore,
            feedback: evaluations,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit answers", error: error.message });
    }
};

/**
 * GET /api/session/history
 * Get all completed sessions for logged-in user (summary only)
 */
export const getHistory = async (req, res) => {
    try {
        const sessions = await Session.find({
            userId: req.user._id,
            status: "completed",
        })
            .select("_id role difficulty overallScore createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve session history", error: error.message });
    }
};

/**
 * GET /api/session/:id
 * Get full details of a specific session (including qaPairs)
 */
export const getSessionDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const session = await Session.findById(id);
        
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to access this session" });
        }

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve session details", error: error.message });
    }
};
