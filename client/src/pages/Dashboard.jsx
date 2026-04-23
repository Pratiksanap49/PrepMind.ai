import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Play, Activity, Clock, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/session/history");
        setRecentSessions(res.data.slice(0, 3));
      } catch (err) {
        setError("Failed to load recent sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <PageTransition className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-12 lg:py-20">
        
        {/* Hero Section */}
        <div className="relative mb-16 p-8 sm:p-12 glass-card rounded-3xl overflow-hidden border border-white/10">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
                <Activity className="w-4 h-4" />
                <span>Ready for action</span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">{user?.name || "User"}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-lg text-gray-400 mb-8"
            >
              Your next breakthrough is just one practice session away. Customize an interview tailored exactly to your dream role.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Button
                className="h-14 px-8 text-lg font-medium bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.7)] hover:scale-[1.02]"
                onClick={() => navigate("/setup")}
              >
                <Play className="mr-2 h-5 w-5 fill-current" /> Initialize Session
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Recent Activity
            </h2>
            {recentSessions.length > 0 && (
              <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => navigate("/history")}>
                View all <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            </div>
          )}

          {error && (
            <div className="glass-card border-destructive/50 bg-destructive/10 p-4 rounded-2xl text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && recentSessions.length === 0 && (
            <div className="glass-card text-center py-16 rounded-3xl border border-white/5">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No attempts yet</h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                Once you complete your first AI interview, your analytics and feedback will appear here.
              </p>
            </div>
          )}

          {!loading && recentSessions.length > 0 && (
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentSessions.map((session) => (
                <StaggerItem key={session._id}>
                  <div className="glass-card rounded-2xl p-6 h-full flex flex-col transition-all hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)] group cursor-pointer" onClick={() => navigate("/history")}>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-1">
                        {session.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-300 font-medium capitalize border-white/10">
                          {session.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {session.overallScore ?? "N/A"}/10
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4 mt-auto border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(session.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </span>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        Details <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
