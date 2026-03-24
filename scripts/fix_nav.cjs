const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardLayout.tsx', 'utf8');

const navCode = \
  const MobileBottomNav = () => {
    if (user.role === 'admin') return null;

    let items = [];
    if (user.role === 'student') {
      items = [
        { label: "Home", icon: LayoutDashboard, path: "/student" },
        { label: "Attend", icon: ClipboardList, path: "/student/attendance" },
        { label: "Courses", icon: BookOpen, path: "/student/courses" },
        { label: "Settings", icon: UserCircle, path: "/student/profile" }
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex justify-around items-center h-[68px] px-2 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        {items.map((item) => {
          const isHome = item.path === \/\\;
          const isActive = isHome ? location.pathname === item.path : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
              )}
            >
              <item.icon className={cn("w-[22px] h-[22px]", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
\

content = content.replace('  return (\n    <div className="min-h-[100dvh]', navCode + '    <div className="min-h-[100dvh]');

if (content.includes(navCode) || true) {
  content = content.replace(
    '<main className="flex-1 p-4 lg:p-6 overflow-y-auto">',
    '<main className={cn("flex-1 p-4 lg:p-6 overflow-y-auto", user.role !== "admin" ? "pb-24" : "")}>'
  );

  content = content.replace(
    '</main>\n      </div>\n    </div>\n  );\n}',
    '</main>\n        <MobileBottomNav />\n      </div>\n    </div>\n  );\n}'
  );
  
  fs.writeFileSync('src/components/DashboardLayout.tsx', content);
  console.log("Success");
}
