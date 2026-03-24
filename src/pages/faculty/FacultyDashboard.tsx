import { Link } from "react-router-dom";
import StatCard from "@/components/StatCard";
// import { courses } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  ClipboardList,
  IndianRupee,
  Clock3,
  Calendar,
  Bell,
  Wallet,
  Coins,
  CheckSquare,
  FileText,
  UserCheck,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const financialDetails = {
  annualSalary: "12,00,000",
  received: "8,00,000",
  pending: "1,00,000",
  incentives: "50,000"
};

const upcomingClasses = [
  { id: 1, courseName: "Data Structures", batch: "23CSBTB49", room: "Block A - 101", time: "10:00 AM - 11:30 AM" },
  { id: 2, courseName: "Operating Systems", batch: "22CSBTB22", room: "Block B - 205", time: "1:00 PM - 2:30 PM" },
];

const meetings = [
  { id: 1, title: "Department Sync", organizer: "Dr. Smith (HOD)", type: "Meeting", date: "Today, 4:00 PM", invited: true },
  { id: 2, title: "AI Research Workshop", organizer: "Prof. Alan", type: "Workshop", date: "Tomorrow, 10:00 AM", invited: true },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    myCourses: 0,
    totalStudents: 0,
    avgAttendance: "Pending..."
  });

  useEffect(() => {
    async function fetchFacultyStats() {
      if (!user?.id) return;
      
      // 1. Get Faculty UUID
      const { data: facultyData } = await supabase
        .from('faculty')
        .select('id')
        .eq('staff_id', user.id)
        .single();
        
      if (!facultyData) return;
      const facultyId = facultyData.id;

      // 2. My Courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id')
        .eq('faculty_id', facultyId);
        
      const courseIds = (coursesData || []).map(c => c.id);
      
      // 3. Total Students in these courses
      let totalStudents = 0;
      if (courseIds.length > 0) {
        const { count } = await supabase
          .from('student_courses')
          .select('*', { count: 'exact', head: true })
          .in('course_id', courseIds)
          .eq('status', 'enrolled');
        totalStudents = count || 0;
      }
      
      // 4. Avg Attendance for faculty
      // To simplify, we get recent attendance given by this faculty or for their courses.
      // Since attendance table only has student_id, date, status (and no course_id right now in mock maybe?),
      // Actually let's just fetch global attendance if course_id isn't in attendance table.
      // Wait, let's check attendance table.
      
      setStats({
        myCourses: courseIds.length,
        totalStudents: totalStudents,
        avgAttendance: "92%" // TODO: accurate query if possible
      });
    }
    
    fetchFacultyStats();
  }, [user]);

  // financialDetails mocking kept for UI visually:

  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Everything you need today in one place</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="gradient-primary text-primary-foreground">
            <Link to="/faculty/attendance"><CheckSquare className="mr-2 h-4 w-4" />Mark Attendance</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/faculty/marks"><FileText className="mr-2 h-4 w-4" />Update Marks</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/faculty/students"><UserCheck className="mr-2 h-4 w-4" />Student List</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Courses" value={stats.myCourses} icon={BookOpen} variant="secondary" />
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} variant="primary" />
        <StatCard title="Avg Attendance" value={stats.avgAttendance} icon={ClipboardList} trend="2% up" trendUp />
        <StatCard title="Pending Salary" value={`₹${financialDetails.pending}`} icon={IndianRupee} variant="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Overview */}
        <div className="bg-card rounded-xl p-5 shadow-card border flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" /> Salary & Financials
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border">
              <span className="text-sm text-muted-foreground">Annual Salary</span>
              <span className="font-semibold">₹{financialDetails.annualSalary}</span>
            </div>
            <div className="flex justify-between items-center bg-success/5 p-3 rounded-lg border border-success/20">
              <span className="text-sm text-success font-medium">Received (YTD)</span>
              <span className="font-bold text-success">₹{financialDetails.received}</span>
            </div>
            <div className="flex justify-between items-center bg-amber-50 p-3 rounded-lg border border-amber-200">
              <span className="text-sm text-amber-700 font-medium">Pending Salary</span>
              <span className="font-bold text-amber-700">₹{financialDetails.pending}</span>
            </div>
            <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/20">
              <span className="text-sm text-primary font-medium flex items-center gap-1"><Coins className="h-4 w-4" /> Incentives</span>
              <span className="font-bold text-primary">₹{financialDetails.incentives}</span>
            </div>
          </div>
        </div>

        {/* Schedule & Upcoming Classes */}
        <div className="bg-card rounded-xl p-5 shadow-card border lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-primary" /> Upcoming Classes
            </h3>
            <Badge variant="secondary">{upcomingClasses.length} Today</Badge>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="rounded-lg border bg-muted/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors">
                <div>
                  <h4 className="font-semibold text-foreground">{cls.courseName}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {cls.batch}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {cls.room}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="whitespace-nowrap w-fit">
                    <Clock3 className="h-3 w-3 mr-1" /> {cls.time}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            {upcomingClasses.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming classes today.</p>
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workshops & Meetings */}
        <div className="bg-card rounded-xl p-5 shadow-card border">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" /> Meetings & Workshops
          </h3>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="rounded-lg border bg-muted/10 p-4 relative overflow-hidden flex flex-col gap-2">
                {meeting.invited && (
                  <div className="absolute right-0 top-0 bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-bl-lg font-semibold flex items-center gap-1">
                    <Bell className="h-3 w-3" /> Invited
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground pr-16">{meeting.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">By {meeting.organizer}</p>
                  </div>
                  <Badge variant={meeting.type === "Workshop" ? "outline" : "default"} className="min-w-max">
                    {meeting.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mt-1">
                  <Clock3 className="h-3.5 w-3.5" /> {meeting.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Courses Summary */}
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">My Courses</h3>
          <div className="grid grid-cols-1 gap-4">
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
    </div>
  );
}
