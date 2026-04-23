import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { PageTransition } from "@/components/PageTransition";
import { Sparkles, ArrowRight, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, _id, name, email: userEmail } = res.data;
      login(token, { _id, name, email: userEmail });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex text-foreground">
      {/* Left pane - Decorative */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-white/10 bg-background/50 backdrop-blur-3xl">
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary mix-blend-screen box-glow">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            PrepMind<span className="text-primary">.ai</span>
          </span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span>Next Generation Interview Prep</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Master your next <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 text-glow">technical interview.</span>
            </h1>
            <p className="text-lg text-gray-400">
              Practice dynamically AI-generated questions mapped perfectly to the roles and skills you want to conquer.
            </p>
          </motion.div>
        </div>

        {/* Abstract background blobs for left pane only */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Right pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8 glass-card p-10 rounded-3xl relative z-10">
          
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary box-glow">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              PrepMind<span className="text-primary">.ai</span>
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-red-200"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all h-12 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all h-12 rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.7)] hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:text-white transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
