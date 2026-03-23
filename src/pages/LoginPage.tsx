import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { GraduationCap, Shield, BookOpen, Users, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const roles: { role: UserRole; label: string; icon: React.ElementType; desc: string; gradient: string }[] = [
  { role: "admin", label: "Admin", icon: Shield, desc: "Full system management", gradient: "gradient-primary" },
  { role: "faculty", label: "Faculty", icon: BookOpen, desc: "Course & student management", gradient: "gradient-secondary" },
  { role: "student", label: "Student", icon: Users, desc: "View grades & attendance", gradient: "gradient-accent" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const success = login(email, password, selectedRole);
    if (success) {
      navigate(`/${selectedRole}`);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">UniManage</h1>
          <p className="text-lg text-primary-foreground/80">Modern University Management System</p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-primary-foreground/70 text-sm">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary-foreground">1,250+</p>
              <p>Students</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary-foreground">85</p>
              <p>Faculty</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary-foreground">120</p>
              <p>Courses</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold">UniManage</h1>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground mt-1 mb-6">Sign in to your account to continue</p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles.map(({ role, label, icon: Icon, desc, gradient }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "rounded-xl p-3 text-center border-2 transition-all duration-200",
                  selectedRole === role
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center", gradient)}>
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
              Sign In as {roles.find(r => r.role === selectedRole)?.label}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Demo: Enter any email & password to login
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
