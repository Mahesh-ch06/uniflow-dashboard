import StatCard from "@/components/StatCard";
import { courses, attendanceRecords } from "@/lib/mock-data";
import { BookOpen, Users, ClipboardList, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const myCourses = courses.filter(c => c.facultyId === "F001");

export default function FacultyDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground">Welcome, Prof. James Anderson</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Courses" value={myCourses.length} icon={BookOpen} variant="secondary" />
        <StatCard title="Total Students" value={myCourses.reduce((a, c) => a + c.enrolledStudents, 0)} icon={Users} variant="primary" />
        <StatCard title="Avg Attendance" value="87%" icon={ClipboardList} trend="2% up" trendUp />
        <StatCard title="Pending Grades" value={12} icon={FileText} />
      </div>
      <div className="bg-card rounded-xl p-5 shadow-card border">
        <h3 className="font-display font-semibold text-foreground mb-4">Course Enrollment</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={myCourses.map(c => ({ name: c.code, enrolled: c.enrolledStudents, capacity: c.maxCapacity }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="enrolled" fill="hsl(170,60%,45%)" radius={[4, 4, 0, 0]} name="Enrolled" />
            <Bar dataKey="capacity" fill="hsl(220,15%,88%)" radius={[4, 4, 0, 0]} name="Capacity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="font-display font-semibold text-foreground mb-3">My Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCourses.map(c => (
            <div key={c.id} className="bg-card rounded-xl p-4 border shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-primary">{c.code}</span>
                <span className="text-xs text-muted-foreground">{c.schedule}</span>
              </div>
              <h4 className="font-semibold text-foreground">{c.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{c.enrolledStudents}/{c.maxCapacity} students • {c.credits} credits</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
