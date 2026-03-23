import StatCard from "@/components/StatCard";
import { adminStats, monthlyAttendanceData, departmentEnrollment, feeCollectionData } from "@/lib/mock-data";
import { Users, GraduationCap, BookOpen, Building2, TrendingUp, DollarSign, Bell, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const COLORS = ["hsl(220,70%,50%)", "hsl(170,60%,45%)", "hsl(35,95%,55%)", "hsl(0,72%,51%)", "hsl(260,60%,55%)", "hsl(150,60%,40%)"];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of university operations</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={adminStats.totalStudents.toLocaleString()} icon={Users} trend="12% from last semester" trendUp variant="primary" />
        <StatCard title="Total Faculty" value={adminStats.totalFaculty} icon={GraduationCap} trend="5 new hires" trendUp variant="secondary" />
        <StatCard title="Active Courses" value={adminStats.totalCourses} icon={BookOpen} trend="8 new courses" trendUp variant="accent" />
        <StatCard title="Departments" value={adminStats.totalDepartments} icon={Building2} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance Rate" value={`${adminStats.attendanceRate}%`} icon={ClipboardList} trend="2% improvement" trendUp />
        <StatCard title="Fee Collection" value={`${adminStats.feeCollectionRate}%`} icon={DollarSign} trend="$245K pending" />
        <StatCard title="Pending Fees" value={`$${(adminStats.pendingFees / 1000).toFixed(0)}K`} icon={TrendingUp} />
        <StatCard title="Notifications" value={adminStats.activeNotifications} icon={Bell} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 shadow-card border">
          <h3 className="font-display font-semibold text-foreground mb-4">Monthly Attendance Rate</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyAttendanceData}>
              <defs>
                <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220,70%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(220,70%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="rate" stroke="hsl(220,70%,50%)" fill="url(#attendGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card border">
          <h3 className="font-display font-semibold text-foreground mb-4">Department Enrollment</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={departmentEnrollment} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="students" nameKey="department" label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {departmentEnrollment.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card border lg:col-span-2">
          <h3 className="font-display font-semibold text-foreground mb-4">Fee Collection Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={feeCollectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="collected" fill="hsl(170,60%,45%)" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="hsl(35,95%,55%)" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
