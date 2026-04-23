import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    overallScore: {
        type: Number,
        default: null,
    },
    qaPairs: [
        {
            questionText: String,
            answerText: String,
            score: Number,
            suggestion: String,
        }
    ],
    status: {
        type: String,
        enum: ["in-progress", "completed"],
        default: "in-progress",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
