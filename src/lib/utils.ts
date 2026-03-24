import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateLateFee(dueDateStr: string | null | undefined): number {
  if (!dueDateStr) return 0;
  
  const dueDate = new Date(dueDateStr);
  const now = new Date();
  
  // Set times to midnight to only compare dates
  dueDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  if (now <= dueDate) return 0;
  
  const diffTime = Math.abs(now.getTime() - dueDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return 500;
  if (diffDays <= 14) return 1500;
  return 4000;
}
