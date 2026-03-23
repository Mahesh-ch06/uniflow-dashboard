import StatCard from "@/components/StatCard";
import { marksRecords, attendanceRecords, feeRecords, notifications } from "@/lib/mock-data";
import { ClipboardList, FileText, DollarSign, Bell, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const myAttendance = attendanceRecords.filter(a => a.studentId === "S001");
const myMarks = marksRecords.filter(m => m.studentId === "S001");
const myFees = feeRecords.filter(f => f.studentId === "S001");
const myNotifications = notifications.filter(n => n.targetRole === "student" || n.targetRole === "all").slice(0, 3);

const presentCount = myAttendance.filter(a => a.status === "present").length;
const totalAttendance = myAttendance.length;
const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

const attendancePie = [
  { name: "Present", value: presentCount },
  { name: "Absent", value: myAttendance.filter(a => a.status === "absent").length },
  { name: "Late", value: myAttendance.filter(a => a.status === "late").length },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Alex Thompson</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance Rate" value={`${attendanceRate}%`} icon={ClipboardList} variant="primary" />
        <StatCard title="Enrolled Courses" value={3} icon={BookOpen} variant="secondary" />
        <StatCard title="GPA" value="3.5" icon={FileText} variant="accent" />
        <StatCard title="Pending Fees" value={myFees[0]?.status === "paid" ? "$0" : `$${myFees[0]?.totalFee - myFees[0]?.paidAmount}`} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 shadow-card border">
          <h3 className="font-display font-semibold text-foreground mb-4">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                <Cell fill="hsl(150,60%,40%)" />
                <Cell fill="hsl(0,72%,51%)" />
                <Cell fill="hsl(35,95%,55%)" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card border">
          <h3 className="font-display font-semibold text-foreground mb-4">Recent Grades</h3>
          <div className="space-y-3">
            {myMarks.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground text-sm">{m.courseName}</p>
                  <p className="text-xs text-muted-foreground">Total: {m.total}/100</p>
                </div>
                <Badge variant="outline" className="font-bold text-lg">{m.grade}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-card border">
        <h3 className="font-display font-semibold text-foreground mb-4">Recent Notifications</h3>
        <div className="space-y-2">
          {myNotifications.map(n => (
            <div key={n.id} className={cn("p-3 rounded-lg border", !n.read && "bg-primary/5 border-primary/20")}>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground text-sm">{n.title}</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6 mt-1">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
