import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Award, BookOpen, Download, GraduationCap, LineChart as LineChartIcon, Trophy } from "lucide-react";

interface StudentCourseRow {
  id: string;
  student_id: string;
  course_id: string;
  status: "enrolled" | "completed" | "dropped";
  grade: number | string | null;
  created_at: string | null;
}

interface CourseRow {
  id: string;
  code: string;
  name: string;
  credits: number | null;
  semester: string | null;
  department: string | null;
  course_type: string | null;
  faculty_name: string | null;
}

interface ResultRow {
  id: string;
  courseCode: string;
  courseName: string;
  semester: string;
  credits: number;
  status: "enrolled" | "completed" | "dropped";
  gradePoint: number | null;
  gradeLetter: string;
  department: string;
  facultyName: string;
  courseType: string;
}

const isTableMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

const toGradePoint = (grade: number | string | null): number | null => {
  if (grade === null || grade === undefined || grade === "") return null;

  if (typeof grade === "number") {
    if (!Number.isFinite(grade)) return null;
    if (grade <= 4) return Math.max(0, Math.min(4, Number(grade.toFixed(2))));
    if (grade <= 10) return Number(((grade / 10) * 4).toFixed(2));
    return null;
  }

  const normalized = String(grade).trim().toUpperCase();
  const parsed = Number(normalized);
  if (!Number.isNaN(parsed)) {
    if (parsed <= 4) return Math.max(0, Math.min(4, Number(parsed.toFixed(2))));
    if (parsed <= 10) return Number(((parsed / 10) * 4).toFixed(2));
    return null;
  }

  const letterMap: Record<string, number> = {
    "A+": 4,
    A: 3.7,
    "B+": 3.3,
    B: 3,
    C: 2,
    D: 1,
    F: 0,
  };

  return letterMap[normalized] ?? null;
};

const toGradeLetter = (gradePoint: number | null) => {
  if (gradePoint === null) return "N/A";
  if (gradePoint >= 3.7) return "A+";
  if (gradePoint >= 3.3) return "A";
  if (gradePoint >= 3.0) return "B+";
  if (gradePoint >= 2.0) return "B";
  if (gradePoint >= 1.0) return "C";
  return "F";
};

const semesterSortKey = (semester: string) => {
  const match = semester.match(/\d+/);
  if (match) return Number(match[0]);
  return Number.MAX_SAFE_INTEGER;
};

const sortSemesterLabels = (a: string, b: string) => {
  const keyDiff = semesterSortKey(a) - semesterSortKey(b);
  if (keyDiff !== 0) return keyDiff;
  return a.localeCompare(b);
};

const statusClass = {
  completed: "bg-success/10 text-success border-success/30",
  enrolled: "bg-primary/10 text-primary border-primary/30",
  dropped: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function StudentResult() {
  const { user } = useAuth();
  const [allRows, setAllRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("all");

  const semesterOptions = useMemo(
    () => Array.from(new Set(allRows.map((row) => row.semester))).sort(sortSemesterLabels),
    [allRows],
  );

  const rows = useMemo(() => {
    if (selectedSemester === "all") return allRows;
    return allRows.filter((row) => row.semester === selectedSemester);
  }, [allRows, selectedSemester]);

  const summary = useMemo(() => {
    const completed = rows.filter((row) => row.status === "completed");
    const completedCredits = completed.reduce((sum, row) => sum + row.credits, 0);

    const weightedPoints = completed.reduce((sum, row) => {
      if (row.gradePoint === null) return sum;
      return sum + row.gradePoint * row.credits;
    }, 0);

    const sgpa = completedCredits > 0 ? Number((weightedPoints / completedCredits).toFixed(2)) : null;
    const passCount = completed.filter((row) => row.gradeLetter !== "F" && row.gradeLetter !== "N/A").length;
    const passRate = completed.length > 0 ? Math.round((passCount / completed.length) * 100) : 0;

    return {
      totalCourses: rows.length,
      completedCourses: completed.length,
      completedCredits,
      sgpa,
      passRate,
    };
  }, [rows]);

  const trendData = useMemo(() => {
    const semesterMap = new Map<string, { qualityPoints: number; credits: number }>();

    allRows.forEach((row) => {
      if (row.status !== "completed" || row.gradePoint === null || row.credits <= 0) return;
      const current = semesterMap.get(row.semester) || { qualityPoints: 0, credits: 0 };
      current.qualityPoints += row.gradePoint * row.credits;
      current.credits += row.credits;
      semesterMap.set(row.semester, current);
    });

    let cumulativeQualityPoints = 0;
    let cumulativeCredits = 0;

    return Array.from(semesterMap.entries())
      .sort(([semesterA], [semesterB]) => sortSemesterLabels(semesterA, semesterB))
      .map(([semester, stats]) => {
        const sgpa = stats.credits > 0 ? Number((stats.qualityPoints / stats.credits).toFixed(2)) : 0;
        cumulativeQualityPoints += stats.qualityPoints;
        cumulativeCredits += stats.credits;
        const cgpa = cumulativeCredits > 0 ? Number((cumulativeQualityPoints / cumulativeCredits).toFixed(2)) : 0;
        return {
          semester,
          sgpa,
          cgpa,
        };
      });
  }, [allRows]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user?.id) return;

      const { data: studentData } = await supabase
        .from("students")
        .select("id, hall_ticket_no")
        .eq("hall_ticket_no", user.id)
        .single();

      const candidateStudentIds = Array.from(new Set([user.id, studentData?.id].filter(Boolean) as string[]));

      const { data: registrations, error: registrationsError } = await supabase
        .from("student_courses")
        .select("id, student_id, course_id, status, grade, created_at")
        .in("student_id", candidateStudentIds);

      if (registrationsError) {
        if (isTableMissing(registrationsError.code)) {
          setTableReady(false);
          setAllRows([]);
        }
        setLoading(false);
        return;
      }

      const studentCourses = (registrations || []) as StudentCourseRow[];
      const latestByCourse = new Map<string, StudentCourseRow>();

      studentCourses.forEach((item) => {
        const current = latestByCourse.get(item.course_id);
        if (!current) {
          latestByCourse.set(item.course_id, item);
          return;
        }

        const currentTime = current.created_at ? new Date(current.created_at).getTime() : 0;
        const nextTime = item.created_at ? new Date(item.created_at).getTime() : 0;
        if (nextTime >= currentTime) {
          latestByCourse.set(item.course_id, item);
        }
      });

      const latestCourses = Array.from(latestByCourse.values());
      const courseIds = latestCourses.map((item) => item.course_id);

      const { data: coursesData } = await supabase
        .from("courses")
        .select("id, code, name, credits, semester, department, course_type, faculty_name")
        .in("id", courseIds);

      const coursesMap = new Map<string, CourseRow>();
      ((coursesData || []) as CourseRow[]).forEach((course) => coursesMap.set(course.id, course));

      const mapped: ResultRow[] = latestCourses.map((item) => {
        const course = coursesMap.get(item.course_id);
        const gradePoint = toGradePoint(item.grade);
        return {
          id: item.id,
          courseCode: course?.code || "N/A",
          courseName: course?.name || "Unknown Course",
          semester: course?.semester || "Unassigned",
          credits: Number(course?.credits || 0),
          status: item.status,
          gradePoint,
          gradeLetter: toGradeLetter(gradePoint),
          department: course?.department || "N/A",
          facultyName: course?.faculty_name || "Unassigned",
          courseType: String(course?.course_type || "mandatory"),
        };
      });

      mapped.sort((a, b) => sortSemesterLabels(a.semester, b.semester) || a.courseName.localeCompare(b.courseName));
      setTableReady(true);
      setAllRows(mapped);
      setLoading(false);
    };

    fetchResults();
  }, [user?.id]);

  const handleDownloadPdf = () => {
    if (rows.length === 0) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const generatedAt = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text("Student Result Report", 40, 46);

    doc.setFontSize(10);
    doc.text(`Student: ${user?.name || "N/A"}`, 40, 68);
    doc.text(`ID: ${user?.id || "N/A"}`, 40, 84);
    doc.text(`Semester Filter: ${selectedSemester === "all" ? "All Semesters" : selectedSemester}`, 40, 100);
    doc.text(`Generated: ${generatedAt}`, 40, 116);

    doc.setFontSize(10);
    doc.text(
      `Summary: Courses ${summary.totalCourses} | Completed ${summary.completedCourses} | Credits ${summary.completedCredits} | SGPA ${summary.sgpa ?? "N/A"} | Pass Rate ${summary.passRate}%`,
      40,
      136,
    );

    const head = [["Course Code", "Course", "Semester", "Credits", "Status", "Grade"]];
    const body = rows.map((row) => {
      const grade = row.status !== "completed" ? "Pending" : `${row.gradeLetter} (${row.gradePoint?.toFixed(2) ?? "N/A"})`;
      return [
        row.courseCode,
        row.courseName,
        row.semester,
        String(row.credits),
        row.status,
        grade,
      ];
    });

    autoTable(doc, {
      startY: 150,
      head,
      body,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [36, 99, 235] },
      theme: "striped",
      margin: { left: 40, right: 40 },
    });

    const safeSemester = selectedSemester === "all"
      ? "all"
      : selectedSemester.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    doc.save(`student-result-${safeSemester}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Student Result</h1>
        <p className="text-muted-foreground">Official result summary with semester-wise performance</p>
      </div>

      {!tableReady && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Result table is not configured yet. Run student course registration SQL setup first.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Courses</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-foreground">{summary.totalCourses}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completed</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-foreground">{summary.completedCourses}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Credits Earned</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-foreground">{summary.completedCredits}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">SGPA</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-primary">{summary.sgpa ?? "N/A"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pass Rate</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-foreground">{summary.passRate}%</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><LineChartIcon className="h-5 w-5 text-primary" /> SGPA / CGPA Trend</CardTitle>
          <CardDescription>Semester-wise SGPA and cumulative CGPA progression</CardDescription>
        </CardHeader>
        <CardContent>
          {trendData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Not enough completed semester data to draw trend.</p>
          ) : (
            <ChartContainer
              className="h-[280px] w-full"
              config={{
                sgpa: { label: "SGPA", color: "hsl(var(--primary))" },
                cgpa: { label: "CGPA", color: "hsl(var(--chart-2))" },
              }}
            >
              <LineChart data={trendData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="semester" tickLine={false} axisLine={false} minTickGap={20} />
                <YAxis domain={[0, 4]} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="sgpa" stroke="var(--color-sgpa)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="cgpa" stroke="var(--color-cgpa)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="rounded-xl border p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end flex-1">
            <div className="space-y-1">
              <Label>Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesterOptions.map((semester) => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 text-sm text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Grades are normalized to 4.0 scale for SGPA/CGPA.
            </div>
          </div>

          <Button type="button" variant="outline" onClick={handleDownloadPdf} disabled={rows.length === 0 || loading}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading result data...</div>
      ) : (
        <DataTable
          data={rows as unknown as Record<string, unknown>[]}
          searchKeys={["courseCode", "courseName", "semester", "department", "facultyName"]}
          searchPlaceholder="Search by course, semester, faculty..."
          columns={[
            { key: "courseCode", label: "Code", render: (item) => <span className="font-mono text-xs font-semibold">{String(item.courseCode)}</span> },
            {
              key: "courseName",
              label: "Course",
              render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{String(item.courseName)}</p>
                  <p className="text-xs text-muted-foreground">{String(item.department)} • {String(item.facultyName)}</p>
                </div>
              ),
            },
            { key: "semester", label: "Semester" },
            { key: "credits", label: "Credits", render: (item) => <span className="font-medium">{String(item.credits)}</span> },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <Badge variant="outline" className={statusClass[String(item.status) as keyof typeof statusClass] || ""}>
                  {String(item.status)}
                </Badge>
              ),
            },
            {
              key: "grade",
              label: "Result",
              render: (item) => {
                const status = String(item.status);
                if (status !== "completed") {
                  return <span className="text-xs text-muted-foreground">Pending</span>;
                }

                const letter = String(item.gradeLetter);
                const points = Number(item.gradePoint);
                return (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      {letter === "A+" ? <Trophy className="h-3 w-3" /> : <Award className="h-3 w-3" />}
                      {letter}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{Number.isFinite(points) ? points.toFixed(2) : "N/A"}</span>
                  </div>
                );
              },
            },
            {
              key: "courseType",
              label: "Type",
              render: (item) => (
                <Badge variant={String(item.courseType).toLowerCase() === "elective" ? "secondary" : "default"}>
                  {String(item.courseType)}
                </Badge>
              ),
            },
          ]}
        />
      )}

      {!loading && rows.length === 0 && (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          <BookOpen className="h-5 w-5 mx-auto mb-2" />
          No result records available for the selected filters.
        </div>
      )}
    </div>
  );
}
