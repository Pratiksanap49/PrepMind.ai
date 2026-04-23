import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/context/SessionContext";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import { CheckCircle, XCircle, ChevronRight, Home, RotateCcw } from "lucide-react";

export default function Feedback() {
  const { questions, answers, feedback, overallScore, clearSession } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!feedback) navigate("/dashboard");
  }, [feedback, navigate]);

  if (!feedback) return null;

  const handleNewInterview = () => {
    clearSession();
    navigate("/setup");
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    if (score >= 5) return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
    return "text-red-400 border-red-400/30 bg-red-400/10";
  };

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12">
        
        {/* Score Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex flex-col items-center justify-center p-12 glass-card rounded-full border-2 border-primary/20 aspect-square relative box-glow">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <h2 className="text-gray-400 font-medium mb-2 relative z-10">Overall Score</h2>
            <div className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 relative z-10 tracking-tighter">
              {overallScore}
            </div>
            <span className="text-gray-500 font-medium mt-2 relative z-10">out of 10</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mt-8 mb-6 tracking-tight">Interview Evaluation Complete</h1>
          
          <div className="flex justify-center gap-4">
            <Button
              className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]"
              onClick={handleNewInterview}
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="w-4 h-4 mr-2" /> Dashboard
            </Button>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4">Detailed Analysis</h3>
          <StaggerContainer className="space-y-6">
            {feedback.map((item, index) => {
              const isSkipped = !answers[index] || answers[index].trim() === "";
              const scoreClass = isSkipped ? "text-red-400 border-red-400/20 bg-red-400/10" : getScoreColor(item.score);

              return (
                <StaggerItem key={index}>
                  <div className="glass-card rounded-2xl overflow-hidden border border-white/10 relative">
                    {/* Score indicator bar left side */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSkipped ? 'bg-red-500' : (item.score >= 8 ? 'bg-emerald-500' : item.score >= 5 ? 'bg-yellow-500' : 'bg-red-500')}`} />
                    
                    <div className="p-6 sm:p-8 pl-8 sm:pl-10">
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-primary mb-2 block tracking-wider uppercase">Question {index + 1}</span>
                          <h4 className="text-lg text-white font-medium leading-relaxed">
                            {questions[index]?.questionText || item.question}
                          </h4>
                        </div>
                        <Badge variant="outline" className={`shrink-0 px-3 py-1 rounded-full text-base ${scoreClass}`}>
                          {isSkipped ? '0' : item.score} / 10
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5">
                        
                        {/* User Answer */}
                        <div className="space-y-3">
                          <h5 className="flex items-center text-sm font-medium text-gray-400">
                            {isSkipped ? <XCircle className="w-4 h-4 mr-2 text-red-500" /> : <ChevronRight className="w-4 h-4 mr-2 text-gray-500" />}
                            Your Response
                          </h5>
                          <div className={`p-4 rounded-xl border ${isSkipped ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 bg-black/40'} text-gray-300 text-sm leading-relaxed h-full`}>
                            {isSkipped ? (
                              <span className="italic text-gray-500">You opted to skip this question.</span>
                            ) : (
                              answers[index]
                            )}
                          </div>
                        </div>

                        {/* AI Suggestion */}
                        <div className="space-y-3">
                          <h5 className="flex items-center text-sm font-medium text-primary">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            AI Insight & Correction
                          </h5>
                          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-gray-200 text-sm leading-relaxed h-full shadow-[0_0_30px_-15px_rgba(139,92,246,0.3)]">
                            {item.suggestion}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

      </main>
    </PageTransition>
  );
}
