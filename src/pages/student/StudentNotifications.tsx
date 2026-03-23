import { notifications } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
  info: { icon: Info, color: "text-info", bg: "bg-info/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  urgent: { icon: Bell, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function StudentNotifications() {
  const myNotifications = notifications.filter(n => n.targetRole === "student" || n.targetRole === "all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with university announcements</p>
      </div>
      <div className="space-y-3">
        {myNotifications.map(n => {
          const config = typeConfig[n.type];
          const Icon = config.icon;
          return (
            <div key={n.id} className={cn("bg-card rounded-xl p-4 border shadow-card flex items-start gap-4", !n.read && "border-l-4 border-l-primary")}>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                <Icon className={cn("w-5 h-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{n.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{n.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
