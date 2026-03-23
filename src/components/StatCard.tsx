import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "default" | "primary" | "secondary" | "accent";
}

const variantStyles = {
  default: "bg-card shadow-card",
  primary: "gradient-primary text-primary-foreground",
  secondary: "gradient-secondary text-secondary-foreground",
  accent: "gradient-accent text-accent-foreground",
};

export default function StatCard({ title, value, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) {
  const isColored = variant !== "default";
  return (
    <div className={cn("rounded-xl p-5 transition-all hover:shadow-elevated", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium", isColored ? "opacity-80" : "text-muted-foreground")}>{title}</p>
          <p className={cn("text-2xl font-bold font-display mt-1", !isColored && "text-foreground")}>{value}</p>
          {trend && (
            <p className={cn("text-xs mt-2 font-medium", isColored ? "opacity-80" : trendUp ? "text-success" : "text-destructive")}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isColored ? "bg-white/20" : "bg-muted")}>
          <Icon className={cn("w-5 h-5", isColored ? "" : "text-muted-foreground")} />
        </div>
      </div>
    </div>
  );
}
