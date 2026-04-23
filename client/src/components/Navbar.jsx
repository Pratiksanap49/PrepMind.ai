import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Home, History as HistoryIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "History", path: "/history", icon: HistoryIcon },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full glass-nav"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:box-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            PrepMind<span className="text-primary">.ai</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div className="flex items-center gap-4">
          {/* Mobile visible basic links just in case */}
          <div className="md:hidden flex gap-4 mr-2">
            <Link to="/dashboard" className="text-gray-400 hover:text-white"><Home className="w-5 h-5"/></Link>
            <Link to="/history" className="text-gray-400 hover:text-white"><HistoryIcon className="w-5 h-5"/></Link>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
            Logout
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
