import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Users, ClipboardList, DollarSign,
  Bell, Calendar, BarChart3, UserCircle, LogOut, Menu, X,
  GraduationCap, FileText, Settings, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Students", icon: Users, path: "/admin/students" },
  { label: "Faculty", icon: GraduationCap, path: "/admin/faculty" },
  { label: "Attendance", icon: ClipboardList, path: "/admin/attendance" },
  { label: "Fees", icon: DollarSign, path: "/admin/fees" },
  { label: "Notifications", icon: Bell, path: "/admin/notifications" },
  { label: "Timetable", icon: Calendar, path: "/admin/timetable" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
];

const facultyNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/faculty" },
  { label: "My Courses", icon: BookOpen, path: "/faculty/courses" },
  { label: "Attendance", icon: ClipboardList, path: "/faculty/attendance" },
  { label: "Marks", icon: FileText, path: "/faculty/marks" },
  { label: "Students", icon: Users, path: "/faculty/students" },
  { label: "Profile", icon: UserCircle, path: "/faculty/profile" },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { label: "Attendance", icon: ClipboardList, path: "/student/attendance" },
  { label: "Marks", icon: FileText, path: "/student/marks" },
  { label: "Fees", icon: DollarSign, path: "/student/fees" },
  { label: "Timetable", icon: Calendar, path: "/student/timetable" },
  { label: "Notifications", icon: Bell, path: "/student/notifications" },
  { label: "Profile", icon: UserCircle, path: "/student/profile" },
];

const roleConfig = {
  admin: { nav: adminNav, label: "Admin Portal", color: "gradient-primary" },
  faculty: { nav: facultyNav, label: "Faculty Portal", color: "gradient-secondary" },
  student: { nav: studentNav, label: "Student Portal", color: "gradient-accent" },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const config = roleConfig[user.role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <h1 className="font-display text-sm font-bold text-sidebar-foreground">UniManage</h1>
              <p className="text-xs text-sidebar-foreground/60">{config.label}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {config.nav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {isActive && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3 px-3 py-2", !sidebarOpen && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-sidebar-foreground">{user.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col gradient-sidebar border-r border-sidebar-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-[72px]"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-64 gradient-sidebar z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 shadow-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { if (window.innerWidth < 1024) setMobileOpen(true); else setSidebarOpen(!sidebarOpen); }}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                {config.nav.find(n => n.path === location.pathname)?.label || "Dashboard"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate(`/${user.role}/notifications`)}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <Badge variant="outline" className="hidden sm:inline-flex capitalize font-display">
              {user.role}
            </Badge>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
