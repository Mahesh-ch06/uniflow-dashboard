import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock3, Download, FilterX } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles = {
  present: "bg-success/10 text-success border-success/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
  late: "bg-warning/10 text-warning border-warning/30",
};

interface AttendanceRow {
  id: string;
  student_id: string;
  course_name: string | null;
  date: string | null;
  status: "present" | "absent" | "late" | null;
  batch_name: string | null;
}

interface StudentLookupRow {
  id: string;
  hall_ticket_no: string;
  name: string;
}

interface AttendanceTableRow {
  id: string;
  studentName: string;
  studentId: string;
  courseName: string;
  batchName: string;
  date: string;
  rawDate: string;
  status: "present" | "absent" | "late";
}

type AttendanceStatus = AttendanceTableRow["status"];

const isAttendanceTableMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

const normalizeKey = (value: string | null | undefined) => String(value || "").trim().toLowerCase();

const formatDate = (value: string | null | undefined) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export default function AdminAttendance() {
  const [rows, setRows] = useState<AttendanceTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | AttendanceStatus>("all");
  const [selectedDate, setSelectedDate] = useState("");

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const availableCourses = useMemo(
    () => Array.from(new Set(rows.map((row) => row.courseName))).sort((a, b) => a.localeCompare(b)),
    [rows],
  );

  const availableBatches = useMemo(
    () => Array.from(new Set(rows.map((row) => row.batchName))).sort((a, b) => a.localeCompare(b)),
    [rows],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (selectedCourse !== "all" && row.courseName !== selectedCourse) return false;
      if (selectedBatch !== "all" && row.batchName !== selectedBatch) return false;
      if (selectedStatus !== "all" && row.status !== selectedStatus) return false;
      if (selectedDate && row.rawDate !== selectedDate) return false;
      return true;
    });
  }, [rows, selectedCourse, selectedBatch, selectedStatus, selectedDate]);

  const stats = useMemo(() => {
    const total = filteredRows.length;
    const present = filteredRows.filter((row) => row.status === "present").length;
    const late = filteredRows.filter((row) => row.status === "late").length;
    const absent = filteredRows.filter((row) => row.status === "absent").length;
    const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return { total, present, late, absent, attendanceRate };
  }, [filteredRows]);

  const courseInsights = useMemo(() => {
    const byCourse = new Map<string, { total: number; presentOrLate: number }>();

    filteredRows.forEach((row) => {
      const current = byCourse.get(row.courseName) || { total: 0, presentOrLate: 0 };
      current.total += 1;
      if (row.status === "present" || row.status === "late") {
        current.presentOrLate += 1;
      }
      byCourse.set(row.courseName, current);
    });

    const ranked = Array.from(byCourse.entries()).map(([courseName, data]) => ({
      courseName,
      total: data.total,
      rate: data.total > 0 ? Math.round((data.presentOrLate / data.total) * 100) : 0,
    }));

    ranked.sort((a, b) => a.rate - b.rate);
    const lowAttendance = ranked.filter((item) => item.rate < 75);

    return {
      lowAttendanceCount: lowAttendance.length,
      topRiskCourses: lowAttendance.slice(0, 3),
    };
  }, [filteredRows]);

  const clearFilters = () => {
    setSelectedCourse("all");
    setSelectedBatch("all");
    setSelectedStatus("all");
    setSelectedDate("");
  };

  const applyTodayFilter = () => {
    setSelectedDate(todayISO);
  };

  const exportFilteredCSV = () => {
    if (filteredRows.length === 0) return;

    const headers = ["Student", "Student ID", "Course", "Batch", "Date", "Status"];
    const escape = (value: string) => `"${String(value).replace(/"/g, '""')}"`;

    const lines = filteredRows.map((row) => [
      escape(row.studentName),
      escape(row.studentId),
      escape(row.courseName),
      escape(row.batchName),
      escape(row.date),
      escape(row.status),
    ].join(","));

    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      const [{ data: attendanceData, error: attendanceError }, { data: studentsData }] = await Promise.all([
        supabase
          .from("attendance")
          .select("id, student_id, course_name, date, status, batch_name")
          .order("date", { ascending: false })
          .limit(3000),
        supabase
          .from("students")
          .select("id, hall_ticket_no, name")
          .limit(6000),
      ]);

      if (attendanceError) {
        if (isAttendanceTableMissing(attendanceError.code)) {
          setTableReady(false);
          setRows([]);
        }
        setLoading(false);
        return;
      }

      const students = (studentsData || []) as StudentLookupRow[];
      const studentsByHall = new Map<string, StudentLookupRow>();
      const studentsById = new Map<string, StudentLookupRow>();

      students.forEach((student) => {
        studentsByHall.set(normalizeKey(student.hall_ticket_no), student);
        studentsById.set(normalizeKey(student.id), student);
      });

      const mappedRows: AttendanceTableRow[] = ((attendanceData || []) as AttendanceRow[]).map((row) => {
        const byHall = studentsByHall.get(normalizeKey(row.student_id));
        const byId = studentsById.get(normalizeKey(row.student_id));
        const student = byHall || byId;
        const normalizedStatus: AttendanceStatus = row.status === "late" || row.status === "absent" ? row.status : "present";

        return {
          id: row.id,
          studentName: student?.name || "Unknown Student",
          studentId: row.student_id,
          courseName: row.course_name || "N/A",
          batchName: row.batch_name || "N/A",
          date: formatDate(row.date),
          rawDate: row.date ? String(row.date).slice(0, 10) : "",
          status: normalizedStatus,
        };
      });

      setTableReady(true);
      setRows(mappedRows);
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchAttendance();

    const channel = supabase
      .channel("admin-attendance-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, () => fetchAttendance())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Attendance Tracking</h1>
        <p className="text-muted-foreground">Monitor attendance across all courses in real time</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Total Records</p>
          <p className="text-lg font-display font-semibold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Present</p>
          <p className="text-lg font-display font-semibold text-success">{stats.present}</p>
        </div>
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Late</p>
          <p className="text-lg font-display font-semibold text-warning">{stats.late}</p>
        </div>
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Absent</p>
          <p className="text-lg font-display font-semibold text-destructive">{stats.absent}</p>
        </div>
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Attendance Rate</p>
          <p className="text-lg font-display font-semibold text-foreground">{stats.attendanceRate}%</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="secondary" className="gap-1">
          <Clock3 className="h-3.5 w-3.5" /> Live
        </Badge>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        )}
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-foreground">Filters & Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={applyTodayFilter}>Today</Button>
            <Button type="button" size="sm" variant="outline" onClick={clearFilters}>
              <FilterX className="h-4 w-4 mr-1" /> Clear
            </Button>
            <Button type="button" size="sm" onClick={exportFilteredCSV} disabled={filteredRows.length === 0}>
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Date</p>
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Course</p>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {availableCourses.map((course) => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Batch</p>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {availableBatches.map((batch) => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Status</p>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as "all" | AttendanceStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-foreground">Risk Insights</h2>
          <Badge variant={courseInsights.lowAttendanceCount > 0 ? "destructive" : "secondary"}>
            {courseInsights.lowAttendanceCount} courses below 75%
          </Badge>
        </div>

        {courseInsights.topRiskCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No low-attendance course found in current filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {courseInsights.topRiskCourses.map((course) => (
              <div key={course.courseName} className="rounded-lg border bg-muted/20 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{course.courseName}</p>
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Records: {course.total}</p>
                <p className="text-lg font-display font-semibold text-destructive">{course.rate}%</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {!tableReady && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Attendance table is not configured yet.
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading realtime attendance...</div>
      ) : (
      <DataTable
        data={filteredRows as unknown as Record<string, unknown>[]}
        searchKeys={["studentName", "studentId", "courseName", "batchName"]}
        searchPlaceholder="Search by student or course..."
        columns={[
          { key: "studentName", label: "Student" },
          { key: "studentId", label: "Hall Ticket / Student ID" },
          { key: "courseName", label: "Course" },
          { key: "batchName", label: "Batch" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status", render: (item) => (
            <Badge variant="outline" className={cn("capitalize", statusStyles[item.status as keyof typeof statusStyles])}>
              {String(item.status)}
            </Badge>
          )},
        ]}
      />
      )}
    </div>
  );
}
