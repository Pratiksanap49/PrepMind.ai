import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq();

/**
 * Generate interview questions using Groq AI.
 * @param {string} role - Target job role
 * @param {string[]} skills - List of relevant skills
 * @param {string} difficulty - easy | medium | hard
 * @param {number} count - Number of questions to generate
 * @returns {string[]} Array of question strings
 */
export async function generateQuestions(role, skills, difficulty, count) {
    const prompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions for a candidate applying for the role of "${role}".

Skills to focus on: ${skills.join(", ")}
Difficulty level: ${difficulty}

Respond ONLY with a valid JSON array of strings. No explanation, no markdown, no code fences.
Example: ["Question 1?", "Question 2?"]`;

    const completion = await groq.chat.completions.create({
        model: "groq/compound-mini",
        messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0]?.message?.content;

    // Strip markdown code fences if present
    const cleaned = result.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const questions = JSON.parse(cleaned);

    if (!Array.isArray(questions)) {
        throw new Error("AI did not return a valid array of questions");
    }

    return questions;
}

/**
 * Evaluate candidate answers using Groq AI.
 * @param {Array<{_id: string, questionText: string}>} questions
 * @param {Array<{questionId: string, answerText: string}>} answers
 * @returns {{ evaluations: Array<{questionId: string, score: number, suggestion: string}>, overallScore: number }}
 */
export async function evaluateAnswers(questions, answers) {
    const qaPairs = questions.map((q) => {
        const answer = answers.find((a) => a.questionId === q._id.toString());
        return {
            questionId: q._id.toString(),
            questionText: q.questionText,
            answerText: answer ? answer.answerText : "No answer provided",
        };
    });

    const prompt = `You are an expert technical interviewer evaluating candidate answers. Evaluate each answer below and provide a score from 1 to 10 and a brief improvement suggestion.

Questions and Answers:
${JSON.stringify(qaPairs, null, 2)}

Respond ONLY with valid JSON in this exact format (no explanation, no markdown, no code fences):
{
  "evaluations": [
    { "questionId": "<questionId>", "score": <1-10>, "suggestion": "<brief suggestion>" }
  ],
  "overallScore": <average score as a number rounded to 1 decimal>
}`;

    const completion = await groq.chat.completions.create({
        model: "groq/compound-mini",
        messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0]?.message?.content;

    // Strip markdown code fences if present
    const cleaned = result.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.evaluations || !Array.isArray(parsed.evaluations)) {
        throw new Error("AI did not return valid evaluations");
    }

    // Calculate overallScore as average if not provided correctly
    if (typeof parsed.overallScore !== "number") {
        const total = parsed.evaluations.reduce((sum, e) => sum + e.score, 0);
        parsed.overallScore = Math.round((total / parsed.evaluations.length) * 10) / 10;
    }

    return parsed;
}
