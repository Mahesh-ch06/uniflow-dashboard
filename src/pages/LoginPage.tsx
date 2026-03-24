import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { GraduationCap, Shield, BookOpen, Users, Eye, EyeOff, Activity, Plug, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

const roles: { role: UserRole; label: string; icon: React.ElementType; desc: string; gradient: string }[] = [
  { role: "admin", label: "Admin", icon: Shield, desc: "Full system management", gradient: "gradient-primary" },
  { role: "faculty", label: "Faculty", icon: BookOpen, desc: "Course & student management", gradient: "gradient-secondary" },
  { role: "student", label: "Student", icon: Users, desc: "View grades & attendance", gradient: "gradient-accent" },
];

const roleHeroContent: Record<
  UserRole,
  {
    badge: string;
    title: string;
    description: string;
    highlights: { icon: React.ElementType; label: string }[];
    stats: { value: string; label: string }[];
  }
> = {
  admin: {
    badge: "Admin Control Center",
    title: "Manage the Entire University from One Place",
    description:
      "Control admissions, academics, finance, operations, and compliance across international campuses.",
    highlights: [
      { icon: Sparkles, label: "System-wide Visibility" },
      { icon: Plug, label: "Cross-department Integration" },
      { icon: Activity, label: "Live Institutional Metrics" },
    ],
    stats: [
      { value: "12", label: "Departments" },
      { value: "42", label: "Countries" },
      { value: "24/7", label: "Operations" },
    ],
  },
  faculty: {
    badge: "Faculty Workspace",
    title: "Teach, Track, and Support Students Efficiently",
    description:
      "Manage attendance, grades, coursework, and student progress with real-time academic tools.",
    highlights: [
      { icon: Sparkles, label: "Course Management" },
      { icon: Plug, label: "Attendance & Marks Sync" },
      { icon: Activity, label: "Live Class Insights" },
    ],
    stats: [
      { value: "120", label: "Courses" },
      { value: "85", label: "Faculty" },
      { value: "1,250+", label: "Students" },
    ],
  },
  student: {
    badge: "Student Portal",
    title: "Your Academic Journey, All in One Dashboard",
    description:
      "Access attendance, marks, fees, timetable, library logs, and campus notifications instantly.",
    highlights: [
      { icon: Sparkles, label: "Academic Progress" },
      { icon: Plug, label: "Library & Fee Tracking" },
      { icon: Activity, label: "Real-time Alerts" },
    ],
    stats: [
      { value: "95%", label: "On-time Updates" },
      { value: "9", label: "Support Languages" },
      { value: "24/7", label: "Portal Access" },
    ],
  },
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const activeRoleContent = roleHeroContent[selectedRole];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier || !password) {
      setError("Please fill in all fields");
      return;
    }
    const success = await login(identifier, password, selectedRole);
    if (success) {
      navigate(`/${selectedRole}`);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      {/* Ambient background decoration for dark mode & light mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-sm">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">UniManage</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto grid min-h-[calc(100vh-4rem)] grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center">
        <motion.section
          key={selectedRole}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 relative z-10"
        >
          <Badge variant="outline" className="font-medium bg-background px-3 py-1 text-primary border-primary/20">{activeRoleContent.badge}</Badge>
          <h1 className="max-w-xl font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl tracking-tight">
            {activeRoleContent.title}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            {activeRoleContent.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {activeRoleContent.highlights.map((item) => (
              <div key={item.label} className="flex items-center gap-2 sm:gap-2.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm">
                <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-2 sm:gap-4 pt-4">
            {activeRoleContent.stats.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-2 sm:p-4 text-center shadow-sm">
                <p className="text-lg sm:text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full relative z-10"
        >
          <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6 sm:p-8 shadow-elevated">
              <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">Welcome back</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your portal to continue</p>
            </div>

            <div className="mb-6 sm:mb-8 grid grid-cols-3 gap-2 sm:gap-3">
              {roles.map(({ role, label, icon: Icon, desc, gradient }) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl p-2 sm:p-3 text-center border-2 transition-all duration-200",
                    selectedRole === role
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-transparent bg-muted/50 hover:bg-muted hover:border-primary/20 hover:shadow-sm"
                  )}
                >
                  <div className={cn("w-8 h-8 sm:w-9 sm:h-9 rounded-lg mb-1.5 sm:mb-2.5 flex items-center justify-center shadow-sm", gradient)}>
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary-foreground" />
                  </div>
                  <p className={cn("text-[10px] sm:text-xs font-semibold", selectedRole === role ? "text-primary" : "text-foreground")}>{label}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {selectedRole === "student" ? "Hall Ticket Number" : selectedRole === "faculty" ? "Staff ID" : "Admin Email"}
                </Label>
                <Input 
                  id="identifier" 
                  type="text" 
                  placeholder={
                    selectedRole === "student" ? "Enter your Hall Ticket No" : 
                    selectedRole === "faculty" ? "Enter your Staff ID" : 
                    "Enter your Admin Email"
                  } 
                  value={identifier} 
                  onChange={e => setIdentifier(e.target.value)} 
                  className="h-11 bg-background/50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Password</span>
                  <a href="#" onClick={(e)=>{e.preventDefault()}} className="text-primary normal-case font-medium hover:underline text-xs">Forgot?</a>
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="h-11 bg-background/50 pr-10" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="h-12 w-full text-base gradient-primary text-primary-foreground font-semibold shadow-glow mt-2">
                Access {roles.find(r => r.role === selectedRole)?.label} Portal
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Demo for Faculty/Admin: Enter any ID & password to login
              </p>
            </form>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
