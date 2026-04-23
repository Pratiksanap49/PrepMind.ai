import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import api from "@/api/axios";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { History as HistoryIcon, Trophy, SearchX, ChevronDown, ChevronUp, MessageSquare, CheckCircle, BrainCircuit } from "lucide-react";

function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async () => {
    if (!expanded && !details) {
      setLoading(true);
      try {
        const res = await api.get(`/api/session/${session._id}`);
        setDetails(res.data);
      } catch (err) {
        setError("Failed to load details.");
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 hover:border-primary/40 hover:bg-white/[0.03] transition-colors overflow-hidden">
      {/* HEADER */}
      <div 
        className="p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
        onClick={handleToggle}
      >
        <div>
          <h3 className="text-xl font-semibold text-white mb-1 tracking-tight flex items-center gap-2">
            {session.role}
          </h3>
          <p className="text-sm text-gray-500">
            Completed on {new Date(session.createdAt).toLocaleDateString("en-US", {
              weekday: 'long', year: "numeric", month: "long", day: "numeric",
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-3 sm:shrink-0 mt-2 sm:mt-0">
          <Badge variant="secondary" className="bg-white/5 text-gray-300 font-medium capitalize border-white/10 px-3 py-1">
            {session.difficulty}
          </Badge>
          <Badge variant="outline" className={`px-3 py-1 text-base flex items-center gap-1.5 ${
            (session.overallScore ?? 0) >= 8 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
            (session.overallScore ?? 0) >= 5 ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
            'border-red-500/30 text-red-400 bg-red-500/10'
          }`}>
            <Trophy className="w-4 h-4" />
            {session.overallScore ?? "N/A"} <span className="text-sm opacity-50">/ 10</span>
          </Badge>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {/* EXPANDABLE DETAILS */}
      {expanded && (
        <div className="border-t border-white/10 p-6 sm:px-8 bg-white/[0.02]">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            </div>
          )}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {details && details.qaPairs && details.qaPairs.length > 0 && (
            <div className="space-y-8">
              {details.qaPairs.map((qa, index) => (
                <div key={index} className="space-y-4 border-b border-white/5 pb-8 last:border-0 last:pb-0">
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/20 p-2 rounded-lg shrink-0">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Question {index + 1}</h4>
                      <p className="text-gray-100 text-lg">{qa.questionText}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pl-2 sm:pl-4 border-l-2 border-white/10 ml-3">
                    <div className="mt-1 bg-white/5 p-2 rounded-lg shrink-0">
                      <CheckCircle className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                        Your Answer
                        <Badge variant="outline" className={`ml-2 ${
                            qa.score >= 8 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                            qa.score >= 5 ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                            'border-red-500/30 text-red-400 bg-red-500/10'
                          }`}>
                            Score: {qa.score}/10
                        </Badge>
                      </h4>
                      <p className="text-gray-300 italic whitespace-pre-wrap">"{qa.answerText}"</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pl-2 sm:pl-4 border-l-2 border-primary/30 ml-3">
                    <div className="mt-1 bg-primary/10 p-2 rounded-lg shrink-0">
                      <BrainCircuit className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary/80 uppercase tracking-wider mb-1">AI Suggestion</h4>
                      <p className="text-gray-200 whitespace-pre-wrap">{qa.suggestion}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
          {details && (!details.qaPairs || details.qaPairs.length === 0) && (
            <p className="text-gray-400 text-sm italic">No details available for this session.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/session/history");
        setSessions(res.data);
      } catch (err) {
        setError("Failed to load session history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12">
        
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary box-glow">
            <HistoryIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Session History</h1>
            <p className="text-gray-400 mt-1">Review your past performance and track your growth.</p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          </div>
        )}

        {error && (
          <div className="glass-card border-destructive/50 bg-destructive/10 p-4 rounded-2xl text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="glass-card text-center py-24 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
            <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <SearchX className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No History Found</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              You haven&apos;t completed any interviews yet. Head back to the dashboard to start your first session.
            </p>
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <StaggerContainer className="space-y-4">
            {sessions.map((session) => (
              <StaggerItem key={session._id}>
                <SessionCard session={session} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </main>
    </PageTransition>
  );
}
