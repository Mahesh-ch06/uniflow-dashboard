const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardLayout.tsx', 'utf8');

if (!content.includes('MobileBottomNav')) {
  const code = \
  const MobileBottomNav = () => {
    if (user.role === 'admin') return null;
    let items = [];
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
          const isHome = item.path === \\\/\\\\\\;
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
    <div className="min-h-[100dvh]\;

  content = content.replace('  return (\\n    <div className="min-h-[100dvh]', code);
  content = content.replace('  return (\\r\\n    <div className="min-h-[100dvh]', code);
  
  content = content.replace(
    '<main className="flex-1 p-4 lg:p-6 overflow-y-auto">',
    '<main className={cn("flex-1 p-4 lg:p-6 overflow-y-auto", user.role !== "admin" ? "pb-24 lg:pb-6" : "")}>'
  );

  content = content.replace(
    '</main>\\n      </div>\\n    </div>\\n  );\\n}',
    '</main>\\n        <MobileBottomNav />\\n      </div>\\n    </div>\\n  );\\n}'
  );
  content = content.replace(
    '</main>\\r\\n      </div>\\r\\n    </div>\\r\\n  );\\r\\n}',
    '</main>\\r\\n        <MobileBottomNav />\\r\\n      </div>\\r\\n    </div>\\r\\n  );\\r\\n}'
  );
  
  fs.writeFileSync('src/components/DashboardLayout.tsx', content);
  console.log("Injected bottom nav ok");
}
