import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { ClipboardList, FileText, DollarSign, IndianRupee, BookOpen, Clock3, Globe2, ShieldCheck, UserCircle, BadgeCheck, GraduationCap, Users, Library, CheckCircle2, Bell, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  const [attendanceRate, setAttendanceRate] = useState<string>("Pending...");
  const [pendingFees, setPendingFees] = useState<string>("Pending...");
  const [enrolledCourses, setEnrolledCourses] = useState<string>("Pending...");
  const [gpa, setGpa] = useState<string>("Pending...");
  const [consecutiveLates, setConsecutiveLates] = useState(0);
  const [lateWarnings, setLateWarnings] = useState<{message: string; type: "warning"|"destructive"} | null>(null);
  const [showWarningBanner, setShowWarningBanner] = useState(true);

  useEffect(() => {
    if (lateWarnings) {
      const timer = setTimeout(() => {
        setShowWarningBanner(false);
      }, 15000); // Hide after 15 seconds
      return () => clearTimeout(timer);
    }
  }, [lateWarnings]);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      
      // Fetch user's attendance records ordered by date DESC
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('status, date')
        .eq('student_id', user.id)
        .order('date', { ascending: false });
        
      if (attendanceData && attendanceData.length > 0) {
        // Calculate basic attendance rate ('late' is traditionally counted as present for the raw percentage unless it converts to an absent)
        const presentOrLateCount = attendanceData.filter(r => r.status === 'present' || r.status === 'late').length;
        const rate = Math.round((presentOrLateCount / attendanceData.length) * 100);
        setAttendanceRate(rate + "%");

        // Calculate consecutive lates
        let lates = 0;
        for (const record of attendanceData) {
          if (record.status === 'late') {
            lates++;
          } else {
            break; // Stop at the first non-late record
          }
        }
        
        // Ensure max lates considered is 3 (because 4th sets absent, resetting count naturally)
        lates = lates % 4; 
        
        setConsecutiveLates(lates);

        // Define warning messages based on consecutive lates
        if (lates === 1) {
          setLateWarnings({ message: "You were late for your last class. (1/3 Lates). Note: 3 consecutive lates will result in an Absent mark on the 4th.", type: "warning" });
        } else if (lates === 2) {
          setLateWarnings({ message: "You have 2 consecutive lates. (2/3 Lates). Only 1 more late before your next late is marked Absent!", type: "warning" });
        } else if (lates === 3) {
          setLateWarnings({ message: "CRITICAL: You have 3 consecutive lates! Your very next late mark will automatically be converted to Absent.", type: "destructive" });
        } else {
          setLateWarnings(null);
        }

      } else {
        setAttendanceRate("N/A");
      }

      // Fetch Pending Fees
      // First get the student's UUID using their hall ticket number (user.id)
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('hall_ticket_no', user.id)
        .single();

      if (!studentError && studentData) {
        const [feesRes, paymentsRes] = await Promise.all([
          supabase.from('student_fees').select('id, amount, paid_amount, due_date, status').eq('student_id', studentData.id).neq('status', 'paid'),
          supabase.from('student_payments').select('fee_id, amount').eq('student_id', studentData.id).eq('status', 'success')
        ]);

        if (feesRes.error) {
          console.error(feesRes.error);
          setPendingFees("₹0");
        } else {
          const feesData = feesRes.data || [];
          const paymentsData = paymentsRes.data || [];
          
          const amountMap: Record<string, number> = {};
          for (const p of paymentsData) {
            if (p.fee_id) {
              amountMap[p.fee_id] = Number(((amountMap[p.fee_id] || 0) + Number(p.amount || 0)).toFixed(2));
            }
          }

          const calculateLateFee = (dueDate: string | null) => {
            if (!dueDate) return 0;
            const due = new Date(dueDate);
            const now = new Date();
            if (now > due) {
              const diffTime = Math.abs(now.getTime() - due.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays * 10;
            }
            return 0;
          };

          const totalPending = feesData.reduce((sum, fee) => {
            const Math = window.Math;
            const amount = Number(fee.amount || 0);
            const rawPaid = Number(fee.paid_amount || 0);
            const paidFromHistory = Number(amountMap[fee.id] || 0);
            const effectivePaid = Math.max(rawPaid, paidFromHistory);
            
            const late = fee.status !== 'paid' ? calculateLateFee(fee.due_date) : 0;
            const totalWithLate = amount + late;
            const remaining = Math.max(0, totalWithLate - effectivePaid);
            return sum + remaining;
          }, 0);
          
          setPendingFees(totalPending > 0 ? "₹" + totalPending.toLocaleString('en-IN') : "₹0");
        }

        // Fetch Enrolled Courses & GPA
        const { data: coursesData } = await supabase
          .from('student_courses')
          .select('id, grade, status')
          .eq('student_id', studentData.id);

        if (coursesData) {
          const enrolled = coursesData.filter(c => c.status === 'enrolled').length;
          setEnrolledCourses(enrolled.toString());

          // Calculate GPA (A=4, B=3, C=2, D=1, F=0)
          const gradedCourses = coursesData.filter(c => c.status === 'completed' && c.grade);
          if (gradedCourses.length > 0) {
            const gradePoints = {
              'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0
            };
            let totalPoints = 0;
            let validGrades = 0;
            
            for (const c of gradedCourses) {
              if (c.grade && gradePoints[c.grade] !== undefined) {
                totalPoints += gradePoints[c.grade];
                validGrades++;
              }
            }
            if (validGrades > 0) {
              setGpa((totalPoints / validGrades).toFixed(2));
            } else {
              setGpa("N/A");
            }
          } else {
            setGpa("N/A");
          }
        } else {
            setEnrolledCourses("0");
            setGpa("N/A");
        }
      } else {
        setPendingFees("₹0");
        setEnrolledCourses("0");
        setGpa("N/A");
      }
    }
    fetchData();
  }, [user]);

  // Calculate studying year and semester based on the admission year.
  // Using the first two digits of hall ticket (e.g. '23' -> 2023)
  const admissionYearRaw = user?.id ? parseInt('20' + user.id.substring(0, 2), 10) : new Date().getFullYear();
  const currentYearDate = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
  
  // Basic calculation logic:
  // Assuming acadmic year starts roughly in August 
  let yearOfStudy = currentYearDate - admissionYearRaw + (currentMonth >= 7 ? 1 : 0);
  
  // Bound the year of study to max 4 years normally
  if (yearOfStudy > 4) yearOfStudy = 4;
  if (yearOfStudy < 1) yearOfStudy = 1;

  // Sems are roughly: 
  // Sem 1: Aug/Sep -> Jan
  // Sem 2: Feb -> July
  const currentSem = (currentMonth >= 1 && currentMonth <= 6) ? 2 : 1; 

  const ordinalSuffix = (i: number) => {
    const j = i % 10, k = i % 100;
    if (j == 1 && k != 11) return i + "st";
    if (j == 2 && k != 12) return i + "nd";
    if (j == 3 && k != 13) return i + "rd";
    return i + "th";
  };
  
  const studyingYearStr = `${ordinalSuffix(yearOfStudy)} Year ${ordinalSuffix(currentSem)} Sem`;
  const admissionYear = admissionYearRaw;

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
    <div className="space-y-6 sm:space-y-8">
      {/* Late Warnings Banner */}
      <div className={`transition-all duration-500 overflow-hidden ${lateWarnings && showWarningBanner ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
        {lateWarnings && (
          <div className={`p-4 rounded-lg flex items-start gap-3 mb-2 ${lateWarnings.type === 'destructive' ? 'bg-destructive/10 border border-destructive text-destructive' : 'bg-amber-500/10 border border-amber-500 text-amber-600 dark:text-amber-500'}`}>
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold">{lateWarnings.type === 'destructive' ? 'Action Required' : 'Attendance Warning'}</h4>
              <p className="text-sm mt-1 opacity-90">{lateWarnings.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Student Profile Hero Card */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 sm:gap-6 relative z-10 w-full">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-md shrink-0">
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-3xl sm:text-4xl font-display font-medium">
              {user?.name?.charAt(0) || <UserCircle className="h-12 w-12" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-3 sm:space-y-2 flex flex-col items-center sm:items-start flex-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 sm:mb-0">
                <Badge variant="outline" className="bg-background text-xs font-semibold px-2 py-0.5">Student</Badge>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              {user?.name || "Student"}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 sm:gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1.5 font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                <BadgeCheck className="h-4 w-4 text-primary" />
                {user?.id}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-muted-foreground/80" />
                {user?.department || "Unassigned"}
              </span>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground/80" />
                Batch {user?.batch || "Unassigned"}
              </span>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <Library className="h-4 w-4 text-muted-foreground/80" />
                {studyingYearStr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard title="Attendance Rate" value={attendanceRate} icon={ClipboardList} variant="primary" />
        <StatCard title="Enrolled Courses" value={enrolledCourses} icon={BookOpen} variant="secondary" />
        <StatCard title="GPA" value={gpa} icon={FileText} variant="accent" />
        <StatCard title="Pending Fees" value={pendingFees} icon={IndianRupee} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm border">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-foreground">Student Profile Details</h3>
            <Badge variant="secondary" className="gap-1.5 px-2 py-1">
              <UserCircle className="h-4 w-4" /> Identity
            </Badge>
          </div>
          <div className="space-y-3.5">
            <div className="flex justify-between items-start sm:items-center gap-2 border-b border-border pb-3">
              <span className="text-muted-foreground text-sm shrink-0">Full Name</span>
              <span className="font-medium text-sm sm:text-base text-right break-words">{user?.name}</span>
            </div>
            <div className="flex justify-between items-start sm:items-center gap-2 border-b border-border pb-3">
              <span className="text-muted-foreground text-sm shrink-0">Hall Ticket Number</span>
              <span className="font-medium text-sm sm:text-base text-right break-words">{user?.id}</span>
            </div>
            <div className="flex justify-between items-start sm:items-center gap-2 border-b border-border pb-3">
              <span className="text-muted-foreground text-sm shrink-0">Batch</span>
              <span className="font-medium text-sm sm:text-base text-right break-words">{user?.batch || "Unassigned"}</span>
            </div>
            <div className="flex justify-between items-start sm:items-center gap-2 border-b border-border pb-3">
              <span className="text-muted-foreground text-sm shrink-0">Department</span>
              <span className="font-medium text-sm sm:text-base text-right break-words">{user?.department || "N/A"}</span>
            </div>
            <div className="flex justify-between items-start sm:items-center gap-2 border-b border-border pb-3">
              <span className="text-muted-foreground text-sm shrink-0">Admission Year</span>
              <span className="font-medium text-sm sm:text-base text-right break-words">{admissionYear}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm border">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-foreground">Recent Notifications</h3>
            <Badge variant="secondary" className="gap-1.5 px-2 py-1">
              <Bell className="h-4 w-4" /> Updates
            </Badge>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
              <p className="text-sm font-semibold text-foreground">Mid-Term Exams Schedule Published</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Check the timetable section for your exam dates and venues.</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
              <p className="text-sm font-semibold text-foreground">Fee Payment Deadline</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">The last date to pay the semester fee without penalty is upcoming.</p>
            </div>
             <div className="rounded-xl border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
              <p className="text-sm font-semibold text-foreground">Library Books Due</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">You have 2 books due for return by the end of this week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
