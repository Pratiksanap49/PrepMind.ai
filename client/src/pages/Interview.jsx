import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import api from "@/api/axios";
import { PageTransition } from "@/components/PageTransition";
import { Loader2, ArrowRight, SkipForward, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Interview() {
  const { sessionId, questions, saveAnswers, saveFeedback } = useSession();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate("/dashboard");
    } else {
      setAnswers(new Array(questions.length).fill(""));
    }
  }, [questions, navigate]);

  if (!questions || questions.length === 0) return null;

  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    const updated = [...answers];
    updated[currentIndex] = currentAnswer;
    setAnswers(updated);
    setCurrentAnswer(answers[currentIndex + 1] || "");
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    const updated = [...answers];
    updated[currentIndex] = "";
    setAnswers(updated);

    if (isLastQuestion) {
      handleSubmit(updated);
    } else {
      setCurrentAnswer(answers[currentIndex + 1] || "");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    const allAnswers = finalAnswers || (() => {
      const updated = [...answers];
      updated[currentIndex] = currentAnswer;
      return updated;
    })();

    saveAnswers(allAnswers);
    setError("");
    setLoading(true);

    try {
      const formattedAnswers = allAnswers.map((ans, idx) => ({
        questionId: questions[idx]._id,
        answerText: ans
      }));
      const res = await api.post(`/api/session/${sessionId}/submit`, {
        questions: questions,
        answers: formattedAnswers,
      });

      const { feedback, overallScore } = res.data;
      saveFeedback(feedback, overallScore);
      navigate("/feedback");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answers. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Zen Mode Progress Bar at absolute top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          className="h-full bg-primary box-glow"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <PageTransition className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10 w-full max-w-4xl mx-auto">
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md"
            >
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              </div>
              <h2 className="text-2xl font-bold text-white mt-8 tracking-tight">Evaluating Responses</h2>
              <p className="text-gray-400 mt-2">AI is parsing your technical context...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full flex-1 flex flex-col justify-center max-w-3xl space-y-8">
          
          {/* Header Info */}
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-primary px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Question Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-relaxed tracking-tight">
                {questions[currentIndex]?.questionText}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Answer Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="relative flex-1 min-h-[300px]"
          >
            {/* Soft inner glow behind textarea */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-md opacity-50" />
            
            <textarea
              placeholder="Type your detailed answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="w-full h-full min-h-[300px] p-8 bg-[#050508]/80 backdrop-blur-xl border border-white/10 rounded-3xl text-lg text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 relative z-10 resize-none transition-all leading-relaxed"
            />
          </motion.div>

          {error && <p className="text-sm text-red-400 text-center bg-destructive/10 py-2 rounded-lg">{error}</p>}

          {/* Action Bar */}
          <motion.div 
            className="flex items-center justify-between pt-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={loading}
              className="text-gray-400 hover:text-white hover:bg-white/5 px-6 rounded-xl"
            >
              <SkipForward className="w-4 h-4 mr-2" /> Skip
            </Button>

            {isLastQuestion ? (
              <Button
                className="h-14 px-8 text-lg font-medium bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.7)] hover:scale-[1.02]"
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" /> Complete Interview
              </Button>
            ) : (
              <Button
                className="h-14 px-8 text-lg font-medium bg-white text-black hover:bg-gray-200 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                onClick={handleNext}
                disabled={loading}
              >
                Next Question <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>
        </div>
      </PageTransition>
    </div>
  );
}
