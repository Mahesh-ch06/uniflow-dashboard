import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Download, FileSpreadsheet, FileText, TrendingUp, Wifi } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import * as XLSX from "xlsx";

type AttendanceStatus = "present" | "absent" | "late";
type RequestType = "leave" | "correction";

interface AttendanceRow {
  id: string;
  courseName: string;
  dateISO: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  semester: string;
}

interface AttendanceRequestRow {
  id: string;
  request_type: RequestType;
  subject: string;
  request_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const statusStyles = {
  present: "bg-success/10 text-success border-success/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
  late: "bg-warning/10 text-warning border-warning/30",
};

const requestStatusStyles = {
  pending: "bg-warning/10 text-warning border-warning/30",
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

const attendanceHealth = (percentage: number) => {
  if (percentage >= 75) return { label: "Safe", className: "text-success" };
  if (percentage >= 65) return { label: "Warning", className: "text-warning" };
  return { label: "Critical", className: "text-destructive" };
};

const healthCardStyles = (percentage: number) => {
  if (percentage >= 75) return "border-success/30 bg-success/5";
  if (percentage >= 65) return "border-warning/30 bg-warning/5";
  return "border-destructive/30 bg-destructive/5";
};

const calculateNeededToReach75 = (presentCount: number, totalCount: number) => {
  if (totalCount <= 0) return 0;
  const needed = Math.ceil((0.75 * totalCount - presentCount) / 0.25);
  return Math.max(0, needed);
};

const calculateCanMiss = (presentCount: number, totalCount: number) => {
  if (totalCount <= 0) return 0;
  const maxMiss = Math.floor(presentCount / 0.75 - totalCount);
  return Math.max(0, maxMiss);
};

export default function StudentAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [requests, setRequests] = useState<AttendanceRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [studentUuid, setStudentUuid] = useState<string>("");
  const [hasRequestsTable, setHasRequestsTable] = useState(true);
  const [timetablePreview, setTimetablePreview] = useState<Array<{ subject: string; day: string; time: string }>>([]);
  const [hasTimetable, setHasTimetable] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>(new Date().toLocaleTimeString());

  const [subjectFilter, setSubjectFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");

  const [requestType, setRequestType] = useState<RequestType>("leave");
  const [requestSubject, setRequestSubject] = useState("all");
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split("T")[0]);
  const [requestReason, setRequestReason] = useState("");

  const studentKeys = useMemo(() => {
    const keys = [user?.id, studentUuid].filter(Boolean) as string[];
    return [...new Set(keys)];
  }, [user?.id, studentUuid]);

  const uniqueSubjects = useMemo(
    () => [...new Set(attendanceRows.map((item) => item.courseName).filter(Boolean))].sort(),
    [attendanceRows],
  );

  const uniqueSemesters = useMemo(
    () => [...new Set(attendanceRows.map((item) => item.semester).filter(Boolean))].sort(),
    [attendanceRows],
  );

  const filteredAttendance = useMemo(() => {
    return attendanceRows.filter((row) => {
      const subjectOk = subjectFilter === "all" || row.courseName === subjectFilter;
      const semesterOk = semesterFilter === "all" || row.semester === semesterFilter;
      return subjectOk && semesterOk;
    });
  }, [attendanceRows, subjectFilter, semesterFilter]);

  const subjectStats = useMemo(() => {
    const map = new Map<string, { present: number; absent: number; total: number }>();
    for (const row of filteredAttendance) {
      const current = map.get(row.courseName) || { present: 0, absent: 0, total: 0 };
      const isPresentLike = row.status === "present" || row.status === "late";
      map.set(row.courseName, {
        present: current.present + (isPresentLike ? 1 : 0),
        absent: current.absent + (row.status === "absent" ? 1 : 0),
        total: current.total + 1,
      });
    }
    return Array.from(map.entries()).map(([subject, values]) => {
      const percentage = values.total > 0 ? Math.round((values.present / values.total) * 100) : 0;
      const needToReach75 = calculateNeededToReach75(values.present, values.total);
      const canMiss = calculateCanMiss(values.present, values.total);
      return {
        id: subject,
        subject,
        ...values,
        percentage,
        needToReach75,
        canMiss,
      };
    });
  }, [filteredAttendance]);

  const overall = useMemo(() => {
    const total = filteredAttendance.length;
    const presentCount = filteredAttendance.filter((row) => row.status === "present" || row.status === "late").length;
    const absentCount = filteredAttendance.filter((row) => row.status === "absent").length;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    return {
      total,
      presentCount,
      absentCount,
      percentage,
      needToReach75: calculateNeededToReach75(presentCount, total),
      canMiss: calculateCanMiss(presentCount, total),
    };
  }, [filteredAttendance]);

  const trendData = useMemo(() => {
    const grouped = new Map<string, { present: number; total: number }>();
    for (const row of filteredAttendance) {
      const current = grouped.get(row.dateISO) || { present: 0, total: 0 };
      grouped.set(row.dateISO, {
        present: current.present + (row.status === "present" || row.status === "late" ? 1 : 0),
        total: current.total + 1,
      });
    }
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateISO, value]) => ({
        date: new Date(dateISO).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        percentage: Math.round((value.present / value.total) * 100),
      }));
  }, [filteredAttendance]);

  const fetchAll = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: studentData } = await supabase
        .from("students")
        .select("id, hall_ticket_no")
        .eq("hall_ticket_no", user.id)
        .single();

      if (studentData?.id) {
        setStudentUuid(studentData.id);
      }

      const candidateKeys = [...new Set([user.id, studentData?.id].filter(Boolean) as string[])];

      const [{ data: coursesData }, attendanceResults] = await Promise.all([
        supabase.from("courses").select("name, semester"),
        Promise.all(candidateKeys.map((key) => supabase.from("attendance").select("*").eq("student_id", key).order("date", { ascending: false }))),
      ]);

      const { data: timetableData, error: timetableError } = await supabase
        .from("timetable")
        .select("*")
        .limit(8);

      if (!timetableError && timetableData) {
        const preview = timetableData.map((item: any) => ({
          subject: item.course_name || item.subject || "Unknown Subject",
          day: item.day || item.weekday || item.date || "TBD",
          time: item.time || item.start_time || item.slot || "TBD",
        }));
        setTimetablePreview(preview);
        setHasTimetable(preview.length > 0);
      } else {
        setTimetablePreview([]);
        setHasTimetable(false);
      }

      const semesterByCourse = new Map<string, string>();
      for (const c of coursesData || []) {
        if (c?.name) semesterByCourse.set(c.name, c.semester || "N/A");
      }

      const allAttendance = attendanceResults.flatMap((result) => result.data || []);
      const seen = new Set<string>();
      const normalized: AttendanceRow[] = [];

      for (let i = 0; i < allAttendance.length; i++) {
        const record = allAttendance[i];
        const key = `${record.id || ""}-${record.student_id || ""}-${record.date || ""}-${record.course_name || ""}`;
        if (seen.has(key)) continue;
        seen.add(key);

        normalized.push({
          id: record.id ?? `${record.student_id}-${record.date}-${record.course_name}-${i}`,
          courseName: record.course_name || "Unknown Subject",
          dateISO: record.date,
          date: new Date(record.date).toLocaleDateString(),
          status: (record.status || "absent") as AttendanceStatus,
          markedBy: record.marked_by_faculty || "System",
          semester: semesterByCourse.get(record.course_name) || "N/A",
        });
      }

      setAttendanceRows(normalized);
      setLastUpdatedAt(new Date().toLocaleTimeString());

      const requestResults = await Promise.all(
        candidateKeys.map((key) =>
          supabase
            .from("attendance_requests")
            .select("id, request_type, subject, request_date, reason, status, created_at")
            .eq("student_id", key)
            .order("created_at", { ascending: false }),
        ),
      );

      const tableMissing = requestResults.some((res) => res.error?.code === "PGRST205" || res.error?.code === "42P01");
      setHasRequestsTable(!tableMissing);

      if (!tableMissing) {
        const allRequests = requestResults.flatMap((result) => result.data || []);
        const seenReq = new Set<string>();
        const normalizedRequests: AttendanceRequestRow[] = [];

        for (const req of allRequests) {
          if (!req?.id || seenReq.has(req.id)) continue;
          seenReq.add(req.id);
          normalizedRequests.push(req as AttendanceRequestRow);
        }

        setRequests(normalizedRequests);
      } else {
        setRequests([]);
      }
    } catch (err: any) {
      toast({
        title: "Error fetching attendance",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`student-attendance-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
        },
        () => {
          fetchAll();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, studentUuid]);

  const downloadCsvReport = () => {
    const headers = ["Date", "Subject", "Semester", "Status", "Faculty"];
    const rows = filteredAttendance.map((item) => [item.date, item.courseName, item.semester, item.status, item.markedBy]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `attendance-report-${user?.id || "student"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadExcelReport = () => {
    const exportRows = filteredAttendance.map((item) => ({
      Date: item.date,
      Subject: item.courseName,
      Semester: item.semester,
      Status: item.status,
      Faculty: item.markedBy,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance-report-${user?.id || "student"}.xlsx`);
  };

  const exportPdfView = () => {
    window.print();
  };

  const handleCreateRequest = async () => {
    if (!requestReason.trim()) {
      toast({ title: "Reason required", description: "Please enter a reason for your request.", variant: "destructive" });
      return;
    }

    if (!hasRequestsTable) {
      toast({
        title: "Attendance requests not configured",
        description: "Run attendance request setup SQL first.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingRequest(true);
    try {
      const subject = requestSubject === "all" ? (subjectFilter === "all" ? "General" : subjectFilter) : requestSubject;
      const payload = {
        student_id: studentUuid || user?.id,
        request_type: requestType,
        subject,
        request_date: requestDate,
        reason: requestReason.trim(),
        status: "pending",
      };

      const { error } = await supabase.from("attendance_requests").insert(payload);
      if (error) throw error;

      setRequestReason("");
      toast({ title: "Request submitted", description: "Your request has been sent for faculty/admin approval." });
      await fetchAll();
    } catch (error: any) {
      toast({ title: "Request failed", description: error.message, variant: "destructive" });
    } finally {
      setSubmittingRequest(false);
    }
  };

  const health = attendanceHealth(overall.percentage);
  const riskSubjects = subjectStats.filter((item) => item.percentage < 75).length;
  const safeSubjects = subjectStats.filter((item) => item.percentage >= 75).length;

  return (
    <div className="space-y-6">
      <Card className={cn("overflow-hidden", healthCardStyles(overall.percentage))}>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-display font-bold text-foreground">My Attendance</h1>
                <Badge variant="outline" className={cn("font-medium", health.className)}>{health.label}</Badge>
              </div>
              <p className="text-muted-foreground">University-grade live attendance monitor with compliance insights.</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5 text-success" /> Live Sync</span>
                <span>Updated {lastUpdatedAt}</span>
              </div>
            </div>

            <div className="w-full lg:max-w-md space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Compliance Progress (Target 75%)</span>
                <span className="font-semibold text-foreground">{overall.percentage}%</span>
              </div>
              <Progress value={overall.percentage} className="h-2.5" />
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-md border bg-background/70 p-2 text-center">
                  <p className="text-muted-foreground">Safe Subjects</p>
                  <p className="font-semibold text-success">{safeSubjects}</p>
                </div>
                <div className="rounded-md border bg-background/70 p-2 text-center">
                  <p className="text-muted-foreground">At Risk</p>
                  <p className="font-semibold text-warning">{riskSubjects}</p>
                </div>
                <div className="rounded-md border bg-background/70 p-2 text-center">
                  <p className="text-muted-foreground">Need to Recover</p>
                  <p className="font-semibold text-foreground">{overall.needToReach75}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Download official attendance reports for submission and record keeping.
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={downloadCsvReport}>
            <Download className="h-4 w-4" /> Download CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={downloadExcelReport}>
            <FileSpreadsheet className="h-4 w-4" /> Download Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportPdfView}>
            <FileText className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Semester</label>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger><SelectValue placeholder="All semesters" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {uniqueSemesters.map((sem) => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Subject</label>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger><SelectValue placeholder="All subjects" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {uniqueSubjects.map((subject) => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {overall.percentage < 75 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Attendance shortage warning</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You need to attend <span className="font-semibold text-foreground">{overall.needToReach75}</span> more classes to reach 75%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overall.percentage}%</div>
            <p className={cn("text-xs mt-1 font-medium", health.className)}>{health.label}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Present / Total</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overall.presentCount}/{overall.total}</div>
            <p className="text-xs mt-1 text-muted-foreground">Late marks counted as present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Need for 75%</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overall.needToReach75}</div>
            <p className="text-xs mt-1 text-muted-foreground">Classes required to recover</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Can Miss</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overall.canMiss}</div>
            <p className="text-xs mt-1 text-muted-foreground">Additional classes before dropping below 75%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timetable Sync</CardTitle>
          <CardDescription>Upcoming classes pulled from timetable for better attendance planning</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasTimetable ? (
            <p className="text-sm text-muted-foreground">Timetable is not configured yet, but attendance tracking remains live.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timetablePreview.map((item, index) => (
                <div key={`${item.subject}-${item.day}-${item.time}-${index}`} className="rounded-lg border p-3">
                  <p className="font-medium text-foreground">{item.subject}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.day} • {item.time}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="log">Date-wise Log</TabsTrigger>
          <TabsTrigger value="requests">Leave & Corrections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Attendance Trend</CardTitle>
              <CardDescription>Daily attendance percentage trend over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading trend...</p>
              ) : trendData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No attendance records available for trend.</p>
              ) : (
                <ChartContainer
                  className="h-[260px] w-full"
                  config={{ percentage: { label: "Attendance %", color: "hsl(var(--primary))" } }}
                >
                  <LineChart data={trendData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="percentage" stroke="var(--color-percentage)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subject-wise Breakdown</CardTitle>
              <CardDescription>Present / Absent / Total classes for each subject</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={subjectStats}
                searchKeys={["subject"]}
                searchPlaceholder="Search by subject..."
                columns={[
                  { key: "subject", label: "Subject" },
                  { key: "present", label: "Present" },
                  { key: "absent", label: "Absent" },
                  { key: "total", label: "Total" },
                  {
                    key: "needToReach75",
                    label: "Need for 75%",
                    render: (item) => (
                      <span className={cn("font-medium", Number(item.needToReach75 || 0) > 0 ? "text-warning" : "text-success")}>
                        {Number(item.needToReach75 || 0)}
                      </span>
                    ),
                  },
                  {
                    key: "percentage",
                    label: "Attendance",
                    render: (item) => {
                      const value = Number(item.percentage || 0);
                      const style = value >= 75 ? "bg-success/10 text-success border-success/30" : value >= 65 ? "bg-warning/10 text-warning border-warning/30" : "bg-destructive/10 text-destructive border-destructive/30";
                      return (
                        <div className="space-y-1.5 min-w-[140px]">
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="outline" className={cn(style)}>{value}%</Badge>
                            <span className="text-xs text-muted-foreground">Can miss {Number(item.canMiss || 0)}</span>
                          </div>
                          <Progress value={value} className="h-1.5" />
                        </div>
                      );
                    },
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date-wise Attendance Log</CardTitle>
              <CardDescription>Track each class day with subject and faculty details</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading attendance...</p>
              ) : (
                <DataTable
                  data={filteredAttendance}
                  searchKeys={["courseName", "markedBy", "semester"]}
                  searchPlaceholder="Search by subject, faculty, or semester..."
                  columns={[
                    { key: "date", label: "Date" },
                    { key: "courseName", label: "Subject" },
                    { key: "semester", label: "Semester" },
                    { key: "markedBy", label: "Faculty" },
                    {
                      key: "status",
                      label: "Status",
                      render: (item) => (
                        <Badge variant="outline" className={cn("capitalize", statusStyles[item.status as keyof typeof statusStyles])}>
                          {String(item.status)}
                        </Badge>
                      ),
                    },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Apply Leave / Request Correction</CardTitle>
              <CardDescription>Submit requests for faculty/admin approval workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Request Type</label>
                  <Select value={requestType} onValueChange={(value) => setRequestType(value as RequestType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leave">Leave</SelectItem>
                      <SelectItem value="correction">Attendance Correction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={requestSubject} onValueChange={setRequestSubject}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">General</SelectItem>
                      {uniqueSubjects.map((subject) => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  placeholder="Explain your leave/correction request..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                />
              </div>

              <Button onClick={handleCreateRequest} disabled={submittingRequest || !hasRequestsTable}>
                {submittingRequest ? "Submitting..." : "Submit Request"}
              </Button>

              {!hasRequestsTable && (
                <p className="text-sm text-warning">Attendance request workflow table is not configured yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Request History</CardTitle>
              <CardDescription>Track pending, approved, and rejected requests</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={requests}
                searchKeys={["subject", "request_type", "reason", "status"]}
                searchPlaceholder="Search request history..."
                columns={[
                  { key: "request_type", label: "Type", render: (item) => <span className="capitalize">{String(item.request_type)}</span> },
                  { key: "subject", label: "Subject" },
                  { key: "request_date", label: "Date" },
                  { key: "reason", label: "Reason" },
                  {
                    key: "status",
                    label: "Status",
                    render: (item) => (
                      <Badge variant="outline" className={cn("capitalize", requestStatusStyles[item.status as keyof typeof requestStatusStyles])}>
                        {String(item.status)}
                      </Badge>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
