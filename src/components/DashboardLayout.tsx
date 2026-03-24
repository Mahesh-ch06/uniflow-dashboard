import { ReactNode, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Users, ClipboardList, DollarSign,
  Bell, Calendar, BarChart3, UserCircle, LogOut, Menu, X,
  GraduationCap, FileText, Settings, ChevronRight, Briefcase, FileSignature, MapPin, Search, ChevronDown, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubNavItem {
  label: string;
  path: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  subItems?: SubNavItem[];
  minYear?: number;
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
  { 
    label: "Attendance", 
    icon: ClipboardList, 
    subItems: [
      { label: "Mark Attendance", path: "/faculty/attendance" },
      { label: "Edit / View Records", path: "/faculty/attendance/edit" },
    ]
  },
  { label: "Marks", icon: FileText, path: "/faculty/marks" },
  { label: "Students", icon: Users, path: "/faculty/students" },
  { label: "Profile", icon: UserCircle, path: "/faculty/profile" },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { 
    label: "Attendance", 
    icon: ClipboardList, 
    subItems: [
      { label: "Daily Attendance", path: "/student/attendance" },
      { label: "Attendance Warnings", path: "/student/attendance-warnings" },
    ]
  },
  { label: "Marks", icon: FileText, path: "/student/marks" },
  { label: "Results", icon: Award, path: "/student/result" },
  { 
    label: "Exams", 
    icon: FileSignature, 
    subItems: [
      { label: "Exam Timetable", path: "/student/exam-timetable" },
      { label: "Hall Ticket", path: "/student/ticket" },
      { label: "Seating Arrangement", path: "/student/seating" },
      { label: "Previous Papers", path: "/student/papers" }
    ]
  },
  { label: "Library", icon: BookOpen, path: "/student/library" },
  { label: "Fees", icon: DollarSign, path: "/student/fees" },
  { label: "Timetable", icon: Calendar, path: "/student/timetable" },
  { label: "Placements", icon: Briefcase, path: "/student/placement", minYear: 3 },
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

  let yearOfStudy = 1;
  if (user?.role === 'student' && user.id) {
    const admissionYearRaw = parseInt('20' + user.id.substring(0, 2), 10);
    const date = new Date();
    const currentYearDate = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    yearOfStudy = currentYearDate - admissionYearRaw + (currentMonth >= 7 ? 1 : 0);
    yearOfStudy = Math.max(1, Math.min(yearOfStudy, 4));
  }

  const visibleNav = config.nav.filter(item => !item.minYear || yearOfStudy >= item.minYear);

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
        {visibleNav.map((item) => {
          const isActive = item.path ? location.pathname === item.path : location.pathname.startsWith("/student/") && item.subItems?.some(s => location.pathname.includes(s.path));
          
          if (item.subItems) {
            return (
              <Collapsible key={item.label} defaultOpen={isActive}>
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 shrink-0" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </div>
                    {sidebarOpen && <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1 pl-10">
                  {sidebarOpen && item.subItems.map(subItem => (
                    <button
                      key={subItem.path}
                      onClick={() => { navigate(subItem.path); setMobileOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                        location.pathname === subItem.path
                          ? "text-sidebar-primary font-medium bg-sidebar-primary/5"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
                      <span className="truncate">{subItem.label}</span>
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => { if(item.path) { navigate(item.path); setMobileOpen(false); } }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                location.pathname === item.path
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {location.pathname === item.path && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
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
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {user.role === 'student' && user.batch ? `Batch: ${user.batch}` : user.email}
              </p>
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

  const MobileBottomNav = () => {
    if (user.role === 'admin') return null;
    let items: any[] = [];
    if (user.role === 'student') {
      items = [
        { label: "Home", icon: LayoutDashboard, path: "/student" },
        { label: "Attend", icon: ClipboardList, path: "/student/attendance" },
        { label: "Courses", icon: BookOpen, path: "/student/courses" },
        { label: "Profile", icon: UserCircle, path: "/student/profile" }
      ];
    } else if (user.role === 'faculty') {
      items = [
        { label: "Home", icon: LayoutDashboard, path: "/faculty" },
        { label: "Courses", icon: BookOpen, path: "/faculty/courses" },
        { label: "Attend", icon: ClipboardList, path: "/faculty/attendance" },
        { label: "Profile", icon: UserCircle, path: "/faculty/profile" }
      ];
    }

    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-[100] flex justify-around items-center h-[68px] px-2 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {items.map((item) => {
          const isHome = item.path === `/${user.role}`;
          const isActive = isHome ? location.pathname === item.path : location.pathname.startsWith(item.path);
          return (
            <button key={item.label} onClick={() => navigate(item.path)} className={cn("flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-colors", isActive ? "text-primary bg-primary/5 rounded-lg my-1" : "text-muted-foreground hover:text-primary/70")}>
              <item.icon className={cn("w-[22px] h-[22px]", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] flex w-full">
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
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-3 lg:px-6 shadow-card min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => { if (window.innerWidth < 1024) setMobileOpen(true); else setSidebarOpen(!sidebarOpen); }}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="min-w-0 truncate">
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground truncate">
                {visibleNav.find(n => n.path === location.pathname)?.label || 
                 visibleNav.find(n => n.subItems?.some(s => s.path === location.pathname))?.subItems?.find(s => s.path === location.pathname)?.label || 
                 "Dashboard"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <ThemeToggle />
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
        <main className={cn("flex-1 p-4 lg:p-6 overflow-y-auto", user.role !== "admin" ? "pb-24 lg:pb-6" : "")}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
