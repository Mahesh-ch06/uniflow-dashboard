import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/StatCard";
import { adminStats, monthlyAttendanceData, departmentEnrollment, feeCollectionData } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { Users, GraduationCap, BookOpen, Building2, TrendingUp, IndianRupee, Bell, ClipboardList, Clock3, Globe2, Languages, Landmark, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COLORS = ["hsl(220,70%,50%)", "hsl(170,60%,45%)", "hsl(35,95%,55%)", "hsl(0,72%,51%)", "hsl(260,60%,55%)", "hsl(150,60%,40%)"];

const campusTimezones = [
  { city: "New York", timezone: "America/New_York" },
  { city: "London", timezone: "Europe/London" },
  { city: "Dubai", timezone: "Asia/Dubai" },
  { city: "Singapore", timezone: "Asia/Singapore" },
];

const internationalMetrics = [
  { title: "International Students", value: "346", note: "From 42 countries", icon: Globe2 },
  { title: "Exchange Partners", value: "18", note: "Across 12 regions", icon: Landmark },
  { title: "Languages Supported", value: "9", note: "Portal + student services", icon: Languages },
];

interface AttendanceRow {
  course_name: string | null;
  status: string | null;
  date: string | null;
  batch_name: string | null;
}

interface CourseAttendanceSummary {
  courseName: string;
  records: number;
  present: number;
  late: number;
  absent: number;
  attendanceRate: number;
}

const isAttendanceTableMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

const toISODate = (value: string | null | undefined) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

export default function AdminDashboard() {
  const [now, setNow] = useState(new Date());
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceTableReady, setAttendanceTableReady] = useState(true);
  const [attendanceLastUpdated, setAttendanceLastUpdated] = useState<Date | null>(null);

  const [liveStats, setLiveStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    totalDepartments: 0
  });

  const todayDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const attendanceOverview = useMemo(() => {
    const todaysRows = attendanceRows.filter((item) => toISODate(item.date) === todayDate);
    const courseMap = new Map<string, CourseAttendanceSummary>();

    let present = 0;
    let late = 0;
    let absent = 0;

    todaysRows.forEach((item) => {
      const courseName = (item.course_name || "Unassigned Course").trim() || "Unassigned Course";
      const status = (item.status || "").toLowerCase();

      const current = courseMap.get(courseName) || {
        courseName,
        records: 0,
        present: 0,
        late: 0,
        absent: 0,
        attendanceRate: 0,
      };

      current.records += 1;

      if (status === "present") {
        current.present += 1;
        present += 1;
      } else if (status === "late") {
        current.late += 1;
        late += 1;
      } else {
        current.absent += 1;
        absent += 1;
      }

      courseMap.set(courseName, current);
    });

    const courses = Array.from(courseMap.values())
      .map((item) => ({
        ...item,
        attendanceRate: item.records > 0
          ? Math.round(((item.present + item.late) / item.records) * 100)
          : 0,
      }))
      .sort((a, b) => {
        if (a.attendanceRate !== b.attendanceRate) return a.attendanceRate - b.attendanceRate;
        return b.records - a.records;
      });

    const totalRecords = todaysRows.length;
    const overallRate = totalRecords > 0
      ? Math.round(((present + late) / totalRecords) * 100)
      : 0;

    return {
      totalRecords,
      present,
      late,
      absent,
      overallRate,
      activeCourses: courses.length,
      courses,
    };
  }, [attendanceRows, todayDate]);

  useEffect(() => {
    async function fetchStats() {
      // Fetch students count
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
        
      // Fetch faculty count
      const { count: facultyCount } = await supabase
        .from('faculty')
        .select('*', { count: 'exact', head: true });
        
      // Count unique departments
      const { data: deptData } = await supabase
        .from('students')
        .select('department');
      const uniqueDepartments = new Set(deptData?.map(d => d.department).filter(Boolean));

      setLiveStats({
        totalStudents: studentCount || 0,
        totalFaculty: facultyCount || 0,
        totalCourses: 0, // Not mapped in DB yet
        totalDepartments: uniqueDepartments.size
      });

      // Fetch recent transactions
      try {
        const { data: txData, error: txError } = await supabase
          .from('student_payments')
          .select('*, students:student_id(name, hall_ticket_no), student_fees:fee_id(title)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!txError && txData) {
          setRecentTransactions(txData);
        }
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    }
    
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("course_name, status, date, batch_name")
        .order("date", { ascending: false })
        .limit(5000);

      if (error) {
        if (isAttendanceTableMissing(error.code)) {
          setAttendanceTableReady(false);
          setAttendanceRows([]);
        }
        setAttendanceLoading(false);
        return;
      }

      setAttendanceTableReady(true);
      setAttendanceRows((data || []) as AttendanceRow[]);
      setAttendanceLastUpdated(new Date());
      setAttendanceLoading(false);
    };

    fetchAttendance();

    const channel = supabase
      .channel("admin-dashboard-attendance-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        () => fetchAttendance(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatCampusTime = (timezone: string) =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: timezone,
    }).format(now);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of university operations</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={liveStats.totalStudents.toLocaleString()} icon={Users} trend="from database" trendUp variant="primary" />
        <StatCard title="Total Faculty" value={liveStats.totalFaculty.toLocaleString()} icon={GraduationCap} trend="from database" trendUp variant="secondary" />
        <StatCard title="Active Courses" value={liveStats.totalCourses.toLocaleString()} icon={BookOpen} trend="0 live courses mapped" trendUp variant="accent" />
        <StatCard title="Departments" value={liveStats.totalDepartments.toLocaleString()} icon={Building2} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceOverview.overallRate}%`}
          icon={ClipboardList}
          trend={attendanceLoading ? "Loading live data..." : `${attendanceOverview.totalRecords} records today`}
          trendUp={attendanceOverview.overallRate >= 75}
        />
        <StatCard title="Fee Collection" value={`${adminStats.feeCollectionRate}%`} icon={IndianRupee} trend="₹245K pending" />
        <StatCard title="Pending Fees" value={`₹${(adminStats.pendingFees / 1000).toFixed(0)}K`} icon={TrendingUp} />
        <StatCard title="Notifications" value={adminStats.activeNotifications} icon={Bell} />
      </div>

      <div className="bg-card rounded-xl p-5 shadow-card border">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-foreground">Attendance Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor attendance across all courses in real time</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Clock3 className="h-3.5 w-3.5" /> Live
            </Badge>
            {attendanceLastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {attendanceLastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </div>
        </div>

        {!attendanceTableReady ? (
          <div className="rounded-lg border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
            Attendance table is not configured yet.
          </div>
        ) : attendanceLoading ? (
          <div className="text-sm text-muted-foreground">Loading realtime attendance...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Today's Records</p>
                <p className="text-lg font-display font-semibold text-foreground">{attendanceOverview.totalRecords}</p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Active Courses</p>
                <p className="text-lg font-display font-semibold text-foreground">{attendanceOverview.activeCourses}</p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Present + Late</p>
                <p className="text-lg font-display font-semibold text-emerald-600">{attendanceOverview.present + attendanceOverview.late}</p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-lg font-display font-semibold text-red-600">{attendanceOverview.absent}</p>
              </div>
            </div>

            {attendanceOverview.courses.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No attendance records found for today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-muted/30 uppercase border-b">
                    <tr>
                      <th className="px-3 py-2 rounded-tl-lg">Course</th>
                      <th className="px-3 py-2">Records</th>
                      <th className="px-3 py-2">Present</th>
                      <th className="px-3 py-2">Late</th>
                      <th className="px-3 py-2">Absent</th>
                      <th className="px-3 py-2 rounded-tr-lg">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {attendanceOverview.courses.map((course) => (
                      <tr key={course.courseName} className="hover:bg-muted/10 transition-colors">
                        <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap">{course.courseName}</td>
                        <td className="px-3 py-3">{course.records}</td>
                        <td className="px-3 py-3 text-emerald-600">{course.present}</td>
                        <td className="px-3 py-3 text-amber-600">{course.late}</td>
                        <td className="px-3 py-3 text-red-600">{course.absent}</td>
                        <td className="px-3 py-3 min-w-[180px]">
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  course.attendanceRate >= 75 ? "bg-emerald-500" : course.attendanceRate >= 60 ? "bg-amber-500" : "bg-red-500",
                                )}
                                style={{ width: `${course.attendanceRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-10 text-right">{course.attendanceRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 shadow-card border">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Global Campus Clocks</h3>
            <Badge variant="secondary" className="gap-1">
              <Clock3 className="h-3.5 w-3.5" /> Live
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {campusTimezones.map((campus) => (
              <div key={campus.city} className="rounded-lg border bg-muted/20 p-3">
                <p className="text-sm font-medium text-foreground">{campus.city}</p>
                <p className="mt-1 text-xl font-display font-bold text-primary">{formatCampusTime(campus.timezone)}</p>
                <p className="text-xs text-muted-foreground">{campus.timezone}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card border">
          <h3 className="font-display font-semibold text-foreground mb-4">International Operations</h3>
          <div className="space-y-3">
            {internationalMetrics.map((metric) => (
              <div key={metric.title} className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                <div className="flex items-center gap-2">
                  <metric.icon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{metric.title}</p>
                    <p className="text-xs text-muted-foreground">{metric.note}</p>
                  </div>
                </div>
                <span className="font-display font-semibold text-foreground">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
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

      {/* Recent Transactions Widget */}
      <div className="bg-card rounded-xl p-5 shadow-card border">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-semibold text-foreground">Recent Fee Transactions</h3>
          <Badge variant="outline" className="gap-1 bg-primary/5 text-primary">
            <Bell className="h-3 w-3" /> Live Updates
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/30 uppercase border-b">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Receipt No</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Fee Title</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-tr-lg">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" /> {tx.receipt_no}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{tx.students?.name}</div>
                      <div className="text-xs text-muted-foreground">{tx.students?.hall_ticket_no}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{tx.student_fees?.title || "N/A"}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn("text-[10px] uppercase", tx.status === 'failed' ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200")}>
                        {tx.status || 'Success'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: 'numeric', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
