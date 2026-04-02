import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

type MarksBreakdown = {
  classTest: number;
  labTest: number;
  mids: number;
  sem: number;
  project: number;
};

type CourseRow = {
  id: string;
  code: string;
  name: string;
  course_type?: "mandatory" | "elective" | string;
};

type StudentRow = {
  id: string;
  name: string;
  hall_ticket_no: string;
  batch_name: string;
};

type EnrollmentRow = {
  student_id: string;
  course_id: string;
  status?: string;
};

type GradeFilter = "all" | "pass" | "fail";
type SortBy = "name" | "hall" | "total";

const MAX_MARKS = {
  classTest: 15,
  labTest: 15,
  mids: 30,
  sem: 30,
  project: 10,
} as const;

const MARK_FIELDS: Array<{ key: keyof MarksBreakdown; label: string; max: number }> = [
  { key: "classTest", label: "Class Test", max: MAX_MARKS.classTest },
  { key: "labTest", label: "Lab Test", max: MAX_MARKS.labTest },
  { key: "mids", label: "Mids", max: MAX_MARKS.mids },
  { key: "sem", label: "Sem", max: MAX_MARKS.sem },
  { key: "project", label: "Project", max: MAX_MARKS.project },
];

const STORAGE_KEY_PREFIX = "faculty_marks_by_context_v2";

const emptyMarks = (): MarksBreakdown => ({
  classTest: 0,
  labTest: 0,
  mids: 0,
  sem: 0,
  project: 0,
});

const toNumber = (value: string) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
};

const clamp = (value: number, max: number) => Math.min(Math.max(0, value), max);

const getTotal = (marks: MarksBreakdown) =>
  marks.classTest + marks.labTest + marks.mids + marks.sem + marks.project;

const getGrade = (total: number) => {
  if (total >= 90) return "A+";
  if (total >= 80) return "A";
  if (total >= 70) return "B+";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  return "F";
};

const seeded = (text: string, salt: number) => {
  let hash = salt;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 100000;
  }
  return hash;
};

const generateSampleMarks = (studentId: string): MarksBreakdown => ({
  classTest: 6 + (seeded(studentId, 11) % 10),
  labTest: 6 + (seeded(studentId, 17) % 10),
  mids: 12 + (seeded(studentId, 23) % 19),
  sem: 12 + (seeded(studentId, 29) % 19),
  project: 4 + (seeded(studentId, 37) % 7),
});

export default function FacultyMarks() {
  const { user } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [marksByContext, setMarksByContext] = useState<
    Record<string, Record<string, MarksBreakdown>>
  >({});
  const [savedAtByContext, setSavedAtByContext] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [assignedBatches, setAssignedBatches] = useState<string[]>([]);
  const [myCourses, setMyCourses] = useState<CourseRow[]>([]);
  const [allStudents, setAllStudents] = useState<StudentRow[]>([]);
  const [electiveStudentsByCourse, setElectiveStudentsByCourse] = useState<Record<string, StudentRow[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [bulkField, setBulkField] = useState<keyof MarksBreakdown>("classTest");
  const [bulkValue, setBulkValue] = useState("");
  const [dirtyByContext, setDirtyByContext] = useState<Record<string, boolean>>({});

  const storageKey = useMemo(
    () => (user?.id ? `${STORAGE_KEY_PREFIX}_${user.id}` : STORAGE_KEY_PREFIX),
    [user?.id],
  );

  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      try {
        if (!user?.id) {
          setAssignedBatches([]);
          setMyCourses([]);
          setAllStudents([]);
          setElectiveStudentsByCourse({});
          return;
        }

        const [{ data: facultyProfile }, { data: courseRows, error: courseError }] = await Promise.all([
          supabase.from("faculty").select("assigned_batches").eq("staff_id", user.id).single(),
          supabase.from("courses").select("id, name, code, course_type").eq("faculty_id", user.id),
        ]);

        const normalizedBatches = Array.from(
          new Set(
            ((facultyProfile?.assigned_batches || []) as string[])
              .map((batch) => String(batch || "").trim())
              .filter(Boolean),
          ),
        ).sort();
        setAssignedBatches(normalizedBatches);

        let loadedCourses = (courseRows || []) as CourseRow[];

        // Backward compatibility: some rows may have only faculty_name populated.
        if ((!loadedCourses || loadedCourses.length === 0) && user.name) {
          const { data: nameMatchedCourses } = await supabase
            .from("courses")
            .select("id, name, code, course_type")
            .eq("faculty_name", user.name);

          loadedCourses = (nameMatchedCourses || []) as CourseRow[];

          if (loadedCourses.length === 0) {
            const { data: fuzzyNameMatchedCourses } = await supabase
              .from("courses")
              .select("id, name, code, course_type")
              .ilike("faculty_name", `%${user.name.trim()}%`);

            loadedCourses = (fuzzyNameMatchedCourses || []) as CourseRow[];
          }
        }

        if (courseError && !loadedCourses.length) {
          console.error("Failed to load faculty courses", courseError);
        }

        const dedupedCourses = Array.from(
          new Map(loadedCourses.map((course) => [course.id, course])).values(),
        );
        setMyCourses(dedupedCourses);

        let cleanedStudents: StudentRow[] = [];

        if (normalizedBatches.length === 0) {
          setAllStudents([]);
        } else {
          const { data: studentsRows, error: studentsError } = await supabase
            .from("students")
            .select("id, name, hall_ticket_no, batch_name")
            .in("batch_name", normalizedBatches);

          if (studentsError) {
            console.error("Failed to load students for assigned batches", studentsError);
            setAllStudents([]);
          } else {
            cleanedStudents = ((studentsRows || []) as StudentRow[]).filter(
              (student) => Boolean(student.batch_name),
            );
            setAllStudents(cleanedStudents);
          }
        }

        const electiveCourses = dedupedCourses.filter((course) => course.course_type === "elective");
        const electiveStudentsMap: Record<string, StudentRow[]> = {};

        if (electiveCourses.length > 0) {
          const courseIds = electiveCourses.map((course) => course.id);
          let enrollmentRows: EnrollmentRow[] = [];

          const enrollmentsRes = await supabase
            .from("student_courses")
            .select("student_id, course_id, status")
            .in("course_id", courseIds);

          if (enrollmentsRes.error) {
            const fallbackEnrollmentsRes = await supabase
              .from("student_courses")
              .select("student_id, course_id")
              .in("course_id", courseIds);

            if (!fallbackEnrollmentsRes.error) {
              enrollmentRows = ((fallbackEnrollmentsRes.data || []) as Array<{ student_id: string; course_id: string }>).map(
                (row) => ({
                  student_id: row.student_id,
                  course_id: row.course_id,
                  status: "enrolled",
                }),
              );
            }
          } else {
            enrollmentRows = (enrollmentsRes.data || []) as EnrollmentRow[];
          }

          const activeEnrollments = enrollmentRows.filter((row) => row.status !== "dropped");

          if (activeEnrollments.length > 0) {
            const normalizeStudentKey = (value: string | undefined | null) => String(value || "").trim().toLowerCase();
            const studentKeys = Array.from(new Set(activeEnrollments.map((row) => row.student_id).filter(Boolean)));

            const studentMapByHall = new Map<string, StudentRow>();
            const studentMapById = new Map<string, StudentRow>();

            cleanedStudents.forEach((student) => {
              if (student.hall_ticket_no) {
                studentMapByHall.set(normalizeStudentKey(student.hall_ticket_no), student);
              }
              if (student.id) {
                studentMapById.set(normalizeStudentKey(student.id), student);
              }
            });

            const studentsByHallRes = await supabase
              .from("students")
              .select("id, name, hall_ticket_no, batch_name")
              .in("hall_ticket_no", studentKeys);

            ((studentsByHallRes.data || []) as StudentRow[]).forEach((student) => {
              if (student.hall_ticket_no) {
                studentMapByHall.set(normalizeStudentKey(student.hall_ticket_no), student);
              }
              if (student.id) {
                studentMapById.set(normalizeStudentKey(student.id), student);
              }
            });

            const unresolvedKeys = studentKeys.filter((key) => {
              const normalizedKey = normalizeStudentKey(key);
              return !studentMapByHall.has(normalizedKey) && !studentMapById.has(normalizedKey);
            });

            if (unresolvedKeys.length > 0) {
              const studentsByIdRes = await supabase
                .from("students")
                .select("id, name, hall_ticket_no, batch_name")
                .in("id", unresolvedKeys);

              ((studentsByIdRes.data || []) as StudentRow[]).forEach((student) => {
                if (student.hall_ticket_no) {
                  studentMapByHall.set(normalizeStudentKey(student.hall_ticket_no), student);
                }
                if (student.id) {
                  studentMapById.set(normalizeStudentKey(student.id), student);
                }
              });
            }

            const resolveStudent = (studentKey: string) => {
              const normalizedKey = normalizeStudentKey(studentKey);
              return studentMapByHall.get(normalizedKey) || studentMapById.get(normalizedKey);
            };

            electiveCourses.forEach((course) => {
              const seenStudents = new Set<string>();
              const courseStudents: StudentRow[] = [];

              activeEnrollments
                .filter((row) => row.course_id === course.id)
                .forEach((row) => {
                  const resolvedStudent = resolveStudent(row.student_id);
                  const resolvedHallTicket = String(
                    resolvedStudent?.hall_ticket_no || row.student_id || "",
                  ).trim();

                  if (!resolvedHallTicket) return;

                  const uniqueKey = normalizeStudentKey(resolvedHallTicket);
                  if (seenStudents.has(uniqueKey)) return;
                  seenStudents.add(uniqueKey);

                  courseStudents.push({
                    id: resolvedStudent?.id || `elective_${course.id}_${resolvedHallTicket}`,
                    hall_ticket_no: resolvedHallTicket,
                    name: resolvedStudent?.name || "Unknown",
                    batch_name: `${course.code} - Elective`,
                  });
                });

              electiveStudentsMap[course.id] = courseStudents;
            });
          }

          electiveCourses.forEach((course) => {
            if (!electiveStudentsMap[course.id]) {
              electiveStudentsMap[course.id] = [];
            }
          });
        }

        setElectiveStudentsByCourse(electiveStudentsMap);
      } catch (error) {
        console.error("Error fetching marks data", error);
        setAssignedBatches([]);
        setMyCourses([]);
        setAllStudents([]);
        setElectiveStudentsByCourse({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [user?.id, user?.name]);

  const selectedCourse = useMemo(
    () => myCourses.find((course) => course.id === selectedCourseId),
    [myCourses, selectedCourseId],
  );

  const isElectiveSelected = selectedCourse?.course_type === "elective";

  const electiveBatchName = useMemo(() => {
    if (!selectedCourse || !isElectiveSelected) return "";
    return `${selectedCourse.code} - Elective`;
  }, [isElectiveSelected, selectedCourse]);

  const mandatoryBatchOptions = useMemo(() => assignedBatches.slice().sort(), [assignedBatches]);

  const batchOptions = useMemo(() => {
    if (isElectiveSelected) {
      return electiveBatchName ? [electiveBatchName] : [];
    }
    return mandatoryBatchOptions;
  }, [electiveBatchName, isElectiveSelected, mandatoryBatchOptions]);

  const batchStudents = useMemo(() => {
    if (isElectiveSelected && selectedCourseId) {
      return electiveStudentsByCourse[selectedCourseId] || [];
    }
    return allStudents.filter((student) => student.batch_name === selectedBatch);
  }, [allStudents, electiveStudentsByCourse, isElectiveSelected, selectedBatch, selectedCourseId]);

  const contextKey = selectedBatch && selectedCourseId ? `${selectedBatch}__${selectedCourseId}` : "";

  useEffect(() => {
    if (isElectiveSelected) {
      setSelectedBatch(electiveBatchName);
      return;
    }

    if (mandatoryBatchOptions.length === 0) {
      setSelectedBatch("");
      return;
    }

    if (!mandatoryBatchOptions.includes(selectedBatch)) {
      setSelectedBatch(mandatoryBatchOptions[0]);
    }
  }, [electiveBatchName, isElectiveSelected, mandatoryBatchOptions, selectedBatch]);

  useEffect(() => {
    if (myCourses.length === 0) {
      setSelectedCourseId("");
      return;
    }
    if (assignedBatches.length === 0) {
      const firstElective = myCourses.find((course) => course.course_type === "elective");
      if (firstElective && firstElective.id !== selectedCourseId) {
        setSelectedCourseId(firstElective.id);
        return;
      }
    }

    if (!myCourses.some((course) => course.id === selectedCourseId)) {
      setSelectedCourseId(myCourses[0].id);
    }
  }, [assignedBatches.length, myCourses, selectedCourseId]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Record<string, Record<string, MarksBreakdown>>;
      setMarksByContext(parsed);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(marksByContext));
  }, [marksByContext, storageKey]);

  useEffect(() => {
    if (!contextKey) return;

    setMarksByContext((prev) => {
      const existingContext = prev[contextKey] ?? {};
      const nextContext = { ...existingContext };
      let changed = false;

      batchStudents.forEach((student) => {
        if (!nextContext[student.id]) {
          nextContext[student.id] = emptyMarks();
          changed = true;
        }
      });

      if (!changed && prev[contextKey]) return prev;

      return {
        ...prev,
        [contextKey]: nextContext,
      };
    });
  }, [batchStudents, contextKey]);

  const currentContextMarks = contextKey ? marksByContext[contextKey] ?? {} : {};
  const isDirty = contextKey ? Boolean(dirtyByContext[contextKey]) : false;

  const displayedStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = batchStudents.filter((student) => {
      const marks = currentContextMarks[student.id] ?? emptyMarks();
      const total = getTotal(marks);

      const matchesSearch =
        query.length === 0 ||
        student.name.toLowerCase().includes(query) ||
        student.hall_ticket_no.toLowerCase().includes(query);

      const matchesGrade =
        gradeFilter === "all" ||
        (gradeFilter === "pass" && total >= 50) ||
        (gradeFilter === "fail" && total < 50);

      return matchesSearch && matchesGrade;
    });

    const sorted = [...filtered].sort((left, right) => {
      let compareResult = 0;

      if (sortBy === "name") {
        compareResult = left.name.localeCompare(right.name);
      } else if (sortBy === "hall") {
        compareResult = (left.hall_ticket_no || "").localeCompare(right.hall_ticket_no || "");
      } else {
        const leftTotal = getTotal(currentContextMarks[left.id] ?? emptyMarks());
        const rightTotal = getTotal(currentContextMarks[right.id] ?? emptyMarks());
        compareResult = leftTotal - rightTotal;
      }

      return sortDirection === "asc" ? compareResult : -compareResult;
    });

    return sorted;
  }, [batchStudents, currentContextMarks, gradeFilter, searchQuery, sortBy, sortDirection]);

  const stats = useMemo(() => {
    const totals = batchStudents.map((student) =>
      getTotal(currentContextMarks[student.id] ?? emptyMarks()),
    );

    const entered = totals.filter((total) => total > 0).length;
    const passCount = totals.filter((total) => total >= 50).length;
    const average = totals.length > 0
      ? Math.round((totals.reduce((acc, total) => acc + total, 0) / totals.length) * 10) / 10
      : 0;
    const topScore = totals.length > 0 ? Math.max(...totals) : 0;

    return {
      total: batchStudents.length,
      visible: displayedStudents.length,
      entered,
      passCount,
      average,
      topScore,
      passRate: batchStudents.length > 0
        ? Math.round((passCount / batchStudents.length) * 100)
        : 0,
    };
  }, [batchStudents, currentContextMarks, displayedStudents.length]);

  useEffect(() => {
    setSearchQuery("");
    setGradeFilter("all");
    setSortBy("name");
    setSortDirection("asc");
    setBulkField("classTest");
    setBulkValue("");
  }, [contextKey]);

  const applyToStudents = (
    students: StudentRow[],
    updater: (marks: MarksBreakdown, student: StudentRow) => MarksBreakdown,
  ) => {
    if (!contextKey || students.length === 0) return;

    setMarksByContext((prev) => {
      const currentContext = prev[contextKey] ?? {};
      const nextContext = { ...currentContext };

      students.forEach((student) => {
        const currentMarks = nextContext[student.id] ?? emptyMarks();
        nextContext[student.id] = updater(currentMarks, student);
      });

      return {
        ...prev,
        [contextKey]: nextContext,
      };
    });

    setDirtyByContext((prev) => ({ ...prev, [contextKey]: true }));
  };

  const handleMarkChange = (
    studentId: string,
    field: keyof MarksBreakdown,
    rawValue: string,
  ) => {
    if (!contextKey) return;
    const maxForField = MAX_MARKS[field];
    const safeValue = clamp(toNumber(rawValue), maxForField);

    setMarksByContext((prev) => ({
      ...prev,
      [contextKey]: {
        ...(prev[contextKey] ?? {}),
        [studentId]: {
          ...(prev[contextKey]?.[studentId] ?? emptyMarks()),
          [field]: safeValue,
        },
      },
    }));

    setDirtyByContext((prev) => ({ ...prev, [contextKey]: true }));
  };

  const handleSave = () => {
    if (!contextKey) return;
    setSavedAtByContext((prev) => ({ ...prev, [contextKey]: new Date().toLocaleTimeString() }));
    setDirtyByContext((prev) => ({ ...prev, [contextKey]: false }));
  };

  const handleAutoFillMarks = () => {
    if (!contextKey || batchStudents.length === 0) return;

    applyToStudents(batchStudents, (_, student) => generateSampleMarks(student.id));
  };

  const handleAutoFillVisibleMarks = () => {
    if (!contextKey || displayedStudents.length === 0) return;
    applyToStudents(displayedStudents, (_, student) => generateSampleMarks(student.id));
  };

  const handleBulkApply = () => {
    if (!contextKey || displayedStudents.length === 0) return;

    const maxForField = MAX_MARKS[bulkField];
    const safeValue = clamp(toNumber(bulkValue), maxForField);

    applyToStudents(displayedStudents, (marks) => ({
      ...marks,
      [bulkField]: safeValue,
    }));
  };

  const handleResetVisible = () => {
    if (!contextKey || displayedStudents.length === 0) return;
    applyToStudents(displayedStudents, () => emptyMarks());
  };

  const handleExportExcel = () => {
    if (!contextKey || !selectedCourse || batchStudents.length === 0) return;

    const rows = batchStudents.map((student) => {
      const marks = currentContextMarks[student.id] ?? emptyMarks();
      const total = getTotal(marks);

      return {
        "Student ID": student.hall_ticket_no || student.id.slice(0, 8),
        "Student Name": student.name,
        Batch: selectedBatch,
        Course: `${selectedCourse.code} - ${selectedCourse.name}`,
        "Class Test (15)": marks.classTest,
        "Lab Test (15)": marks.labTest,
        "Mids (30)": marks.mids,
        "Sem (30)": marks.sem,
        "Project (10)": marks.project,
        "Total (100)": total,
        Grade: getGrade(total),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marks");
    XLSX.writeFile(workbook, `marks_${selectedBatch}_${selectedCourse.code}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Manage Marks</h1>
        <p className="text-muted-foreground">
          Evaluate students out of 100. Mandatory courses use assigned batches, electives use a separate
          enrolled-students batch.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">Loading faculty courses and batches...</div>
      ) : myCourses.length === 0 ? (
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">
          No courses are allocated to your account, so marks cannot be entered yet.
        </div>
      ) : assignedBatches.length === 0 && !myCourses.some((course) => course.course_type === "elective") ? (
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">
          No batches are allocated to your account. Ask admin to assign batches in faculty management.
        </div>
      ) : (
        <>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Select Batch</p>
          <Select value={selectedBatch} onValueChange={setSelectedBatch} disabled={isElectiveSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Choose batch" />
            </SelectTrigger>
            <SelectContent>
              {batchOptions.map((batch) => (
                <SelectItem key={batch} value={batch}>
                  {batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isElectiveSelected && (
            <p className="text-xs text-muted-foreground">
              Elective course selected. Batch is auto-grouped from course registrations.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Select Course</p>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose course" />
            </SelectTrigger>
            <SelectContent>
              {myCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Class Test: {MAX_MARKS.classTest}</Badge>
        <Badge variant="outline">Lab Test: {MAX_MARKS.labTest}</Badge>
        <Badge variant="outline">Mids: {MAX_MARKS.mids}</Badge>
        <Badge variant="outline">Sem: {MAX_MARKS.sem}</Badge>
        <Badge variant="outline">Project: {MAX_MARKS.project}</Badge>
        <Badge variant="secondary">Total: 100</Badge>
      </div>

      {!contextKey ? (
        <div className="rounded-xl border bg-card p-6 text-muted-foreground">
          Select batch and course to add/edit marks.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Showing</p>
                <p className="text-2xl font-semibold text-foreground">{stats.visible}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Entered Marks</p>
                <p className="text-2xl font-semibold text-foreground">{stats.entered}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Average</p>
                <p className="text-2xl font-semibold text-foreground">{stats.average}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-semibold text-foreground">{stats.passRate}%</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {selectedBatch} • {selectedCourse?.code}
              </h3>
              <p className="text-sm text-muted-foreground">
                {stats.visible} shown of {stats.total} students • editable marks sheet
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isDirty && <Badge variant="destructive">Unsaved Changes</Badge>}
              {savedAtByContext[contextKey] && (
                <Badge variant="outline">Saved at {savedAtByContext[contextKey]}</Badge>
              )}
              <Button variant="secondary" onClick={handleAutoFillVisibleMarks}>Auto Fill Visible</Button>
              <Button variant="secondary" onClick={handleAutoFillMarks}>Auto Fill All</Button>
              <Button variant="outline" onClick={handleExportExcel}>Export Excel</Button>
              <Button onClick={handleSave}>{isDirty ? "Save Changes" : "Saved"}</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <Input
                  placeholder="Search by name or hall ticket"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />

                <Select value={gradeFilter} onValueChange={(value) => setGradeFilter(value as GradeFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="pass">Pass (50 and above)</SelectItem>
                    <SelectItem value="fail">Fail (below 50)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort: Name</SelectItem>
                    <SelectItem value="hall">Sort: Hall Ticket</SelectItem>
                    <SelectItem value="total">Sort: Total</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                >
                  Direction: {sortDirection === "asc" ? "Ascending" : "Descending"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto_auto] gap-3 items-center">
                <Select value={bulkField} onValueChange={(value) => setBulkField(value as keyof MarksBreakdown)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select component" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARK_FIELDS.map((field) => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label} (/{field.max})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Value"
                  value={bulkValue}
                  onChange={(event) => setBulkValue(event.target.value)}
                />

                <Button onClick={handleBulkApply}>Apply To Visible</Button>
                <Button variant="outline" onClick={handleResetVisible}>Reset Visible</Button>
              </div>
            </CardContent>
          </Card>

          {displayedStudents.length === 0 && (
            <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
              No students found for current filters.
              {isElectiveSelected ? " Students need to register this elective before marks can be entered." : ""}
            </div>
          )}

          <div className="rounded-xl border bg-card overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  {MARK_FIELDS.map((field) => (
                    <TableHead key={field.key}>{field.label}</TableHead>
                  ))}
                  <TableHead>Total</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedStudents.map((student) => {
                  const marks = currentContextMarks[student.id] ?? emptyMarks();
                  const total = getTotal(marks);
                  const grade = getGrade(total);

                  return (
                    <TableRow key={student.id} className={total > 0 ? "bg-emerald-500/5" : ""}>
                      <TableCell>{student.hall_ticket_no || student.id.slice(0, 8)}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      {MARK_FIELDS.map((field) => (
                        <TableCell key={`${student.id}_${field.key}`}>
                          <Input
                            type="number"
                            min={0}
                            max={field.max}
                            value={marks[field.key]}
                            onChange={(event) =>
                              handleMarkChange(student.id, field.key, event.target.value)
                            }
                            className="w-20"
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Badge variant="secondary">{total}/100</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold">
                          {grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
