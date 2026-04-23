import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useSession } from "@/context/SessionContext";
import api from "@/api/axios";
import { PageTransition } from "@/components/PageTransition";
import { Settings2, Rocket, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Setup() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { startSession } = useSession();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/session/create", {
        role,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        difficulty,
        questionCount: Number(questionCount),
      });

      const { sessionId, questions } = res.data;
      startSession(sessionId, questions);
      navigate("/interview");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create session. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="w-full max-w-2xl"
        >
          <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
            {/* Ambient header glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            
            <div className="p-8 sm:p-10 relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary box-glow">
                  <Settings2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Configure Session</h1>
                  <p className="text-sm text-gray-400">Tailor the AI to your exact interview specifications.</p>
                </div>
              </div>

              <div className="w-full h-px bg-white/5 my-8" />

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-destructive/10 border border-destructive/50 p-4 text-sm text-red-200">
                    {error}
                  </motion.div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="role" className="text-gray-300 font-medium">Target Role</Label>
                    <Input
                      id="role"
                      type="text"
                      placeholder="e.g. Senior Frontend Developer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 h-12 rounded-xl text-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="skills" className="text-gray-300 font-medium">Core Skills <span className="text-gray-500 text-xs ml-1">(comma separated)</span></Label>
                    <Input
                      id="skills"
                      type="text"
                      placeholder="e.g. React, Next.js, System Design"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-gray-300 font-medium">Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty} required>
                      <SelectTrigger id="difficulty" className="bg-black/20 border-white/10 text-white h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0f] border-white/10 text-white">
                        <SelectItem value="easy" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Easy (Junior)</SelectItem>
                        <SelectItem value="medium" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Medium (Mid-level)</SelectItem>
                        <SelectItem value="hard" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Hard (Senior)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionCount" className="text-gray-300 font-medium">Length</Label>
                    <Select value={questionCount} onValueChange={setQuestionCount} required>
                      <SelectTrigger id="questionCount" className="bg-black/20 border-white/10 text-white h-12 rounded-xl focus:ring-primary/20 focus:border-primary/50">
                        <SelectValue placeholder="Select question count" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0f] border-white/10 text-white">
                        <SelectItem value="5" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Short (5 Questions)</SelectItem>
                        <SelectItem value="10" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Standard (10 Questions)</SelectItem>
                        <SelectItem value="15" className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">Deep Dive (15 Questions)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.7)] hover:scale-[1.02]"
                    disabled={loading || !difficulty || !questionCount || !role || !skills}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating AI Engine sequence...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Launch Interview <Rocket className="w-5 h-5 ml-1" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
