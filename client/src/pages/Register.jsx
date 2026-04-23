import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { PageTransition } from "@/components/PageTransition";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
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
      const res = await api.post("/api/auth/register", { name, email, password });
      const { token, _id, name: userName, email: userEmail } = res.data;
      login(token, { _id, name: userName, email: userEmail });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex text-foreground">
      {/* Left pane - Decorative */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-white/10 bg-background/50 backdrop-blur-3xl order-2">
        <div className="relative z-10 flex items-center justify-end gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">
            PrepMind<span className="text-primary">.ai</span>
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary mix-blend-screen box-glow">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-md ml-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6 justify-end">
              <span>Accelerate Your Career</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Begin your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-cyan-400 text-glow">journey today.</span>
            </h1>
            <p className="text-lg text-gray-400">
              Join thousands of developers using PrepMind to unlock their dream roles with precision AI feedback.
            </p>
          </motion.div>
        </div>

        {/* Abstract background blobs for left pane only */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Right pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 order-1">
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
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join the next generation of interview prep.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-red-200"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all h-12 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
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

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
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
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.7)] hover:scale-[1.02] mt-4"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-white transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
