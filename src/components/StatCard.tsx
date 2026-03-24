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
  default: "bg-card border shadow-sm",
  primary: "bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 shadow-sm",
  secondary: "bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 shadow-sm",
  accent: "bg-orange-50/50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 shadow-sm",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
  secondary: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  accent: "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400",
};

export default function StatCard({ title, value, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("rounded-xl p-4 sm:p-5 transition-all hover:shadow-md flex flex-col justify-between h-full border", variantStyles[variant])}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0", iconStyles[variant])}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <div className="mt-auto">
        <p className="text-xl sm:text-2xl font-bold font-display text-foreground">{value}</p>
        {trend && (
          <p className={cn("text-xs mt-1.5 sm:mt-2 font-medium", trendUp ? "text-emerald-500" : "text-red-500")}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}
