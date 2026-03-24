const fs = require('fs');
let c = fs.readFileSync('src/components/DashboardLayout.tsx', 'utf8');

if (!c.includes('MobileBottomNav')) {
  // We'll append a MobileBottomNav component at the bottom, and use it
  const bottomNavComponent = \

  const MobileBottomNav = () => {
    // Only show on student/faculty
    if (user.role === 'admin') return null;

    let items = [];
    if (user.role === 'student') {
      items = [
        { label: "Home", icon: LayoutDashboard, path: "/student" },
        { label: "Attendance", icon: ClipboardList, path: "/student/attendance" },
        { label: "Courses", icon: BookOpen, path: "/student/courses" },
        { label: "Fees", icon: DollarSign, path: "/student/fees" },
        { label: "Profile", icon: UserCircle, path: "/student/profile" }
      ];
    } else if (user.role === 'faculty') {
      items = [
        { label: "Home", icon: LayoutDashboard, path: "/faculty" },
        { label: "Courses", icon: BookOpen, path: "/faculty/courses" },
        { label: "Attend", icon: ClipboardList, path: "/faculty/attendance" },
        { label: "Students", icon: Users, path: "/faculty/students" },
        { label: "Profile", icon: UserCircle, path: "/faculty/profile" }
      ];
    }

    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex justify-around items-center h-16 px-2 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        {items.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== \/\\ && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };
\;

  // Insert before the component return
  c = c.replace(/return \(\s*<div className="min-h-\[100dvh\]/, bottomNavComponent + '\n  return (\n    <div className="min-h-[100dvh]');

  // Add padding-bottom to the main flex-1 container to account for the bottom nav
  // We'll replace <main className="flex-1 p-4 lg:p-6 overflow-y-auto"> with an extra pb value
  c = c.replace(
    '<main className="flex-1 p-4 lg:p-6 overflow-y-auto">',
    '<main className={cn("flex-1 p-4 lg:p-6 overflow-y-auto", user.role !== "admin" ? "pb-20" : "")}>'
  );

  // Append <MobileBottomNav /> before </div> of the main content
  c = c.replace(
    '</main>\n      </div>\n    </div>\n  );\n}',
    '</main>\n        <MobileBottomNav />\n      </div>\n    </div>\n  );\n}'
  );

  fs.writeFileSync('src/components/DashboardLayout.tsx', c);
  console.log('Mobile bottom nav added');
}
