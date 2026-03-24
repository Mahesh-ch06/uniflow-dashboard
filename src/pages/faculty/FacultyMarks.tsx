import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { allStudents, courses } from "@/lib/mock-data";
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

type MarksBreakdown = {
  classTest: number;
  labTest: number;
  mids: number;
  sem: number;
  project: number;
};

const MAX_MARKS = {
  classTest: 15,
  labTest: 15,
  mids: 30,
  sem: 30,
  project: 10,
} as const;

const STORAGE_KEY = "faculty_marks_by_context_v1";

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

  const myCourses = useMemo(
    () => courses.filter((course) => course.facultyId === user?.id),
    [user?.id],
  );

  const batchOptions = useMemo(
    () =>
      Array.from(
        new Set(
          allStudents
            .filter((student) => student.role === "student" && student.batch)
            .map((student) => student.batch as string),
        ),
      ).sort(),
    [],
  );

  const batchStudents = useMemo(
    () => allStudents.filter((student) => student.role === "student" && student.batch === selectedBatch),
    [selectedBatch],
  );

  const selectedCourse = useMemo(
    () => myCourses.find((course) => course.id === selectedCourseId),
    [myCourses, selectedCourseId],
  );

  const contextKey = selectedBatch && selectedCourseId ? `${selectedBatch}__${selectedCourseId}` : "";

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Record<string, Record<string, MarksBreakdown>>;
      setMarksByContext(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(marksByContext));
  }, [marksByContext]);

  useEffect(() => {
    if (!contextKey || marksByContext[contextKey]) return;

    const initial: Record<string, MarksBreakdown> = {};
    batchStudents.forEach((student) => {
      initial[student.id] = emptyMarks();
    });

    setMarksByContext((prev) => ({ ...prev, [contextKey]: initial }));
  }, [batchStudents, contextKey, marksByContext]);

  const currentContextMarks = contextKey ? marksByContext[contextKey] ?? {} : {};

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
  };

  const handleSave = () => {
    if (!contextKey) return;
    setSavedAtByContext((prev) => ({ ...prev, [contextKey]: new Date().toLocaleTimeString() }));
  };

  const handleAutoFillMarks = () => {
    if (!contextKey || batchStudents.length === 0) return;

    const filledMarks: Record<string, MarksBreakdown> = {};
    batchStudents.forEach((student) => {
      filledMarks[student.id] = generateSampleMarks(student.id);
    });

    setMarksByContext((prev) => ({
      ...prev,
      [contextKey]: {
        ...(prev[contextKey] ?? {}),
        ...filledMarks,
      },
    }));
  };

  const handleExportExcel = () => {
    if (!contextKey || !selectedCourse || batchStudents.length === 0) return;

    const rows = batchStudents.map((student) => {
      const marks = currentContextMarks[student.id] ?? emptyMarks();
      const total = getTotal(marks);

      return {
        "Student ID": student.id,
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
        <p className="text-muted-foreground">Evaluate students out of 100 and edit marks by batch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Select Batch</p>
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {selectedBatch} • {selectedCourse?.code}
              </h3>
              <p className="text-sm text-muted-foreground">
                {batchStudents.length} students • editable marks sheet
              </p>
            </div>
            <div className="flex items-center gap-2">
              {savedAtByContext[contextKey] && (
                <Badge variant="outline">Saved at {savedAtByContext[contextKey]}</Badge>
              )}
              <Button variant="secondary" onClick={handleAutoFillMarks}>Auto Fill Marks</Button>
              <Button variant="outline" onClick={handleExportExcel}>Export Excel</Button>
              <Button onClick={handleSave}>Save Marks</Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class Test</TableHead>
                  <TableHead>Lab Test</TableHead>
                  <TableHead>Mids</TableHead>
                  <TableHead>Sem</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchStudents.map((student) => {
                  const marks = currentContextMarks[student.id] ?? emptyMarks();
                  const total = getTotal(marks);
                  const grade = getGrade(total);

                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={MAX_MARKS.classTest}
                          value={marks.classTest}
                          onChange={(event) =>
                            handleMarkChange(student.id, "classTest", event.target.value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={MAX_MARKS.labTest}
                          value={marks.labTest}
                          onChange={(event) =>
                            handleMarkChange(student.id, "labTest", event.target.value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={MAX_MARKS.mids}
                          value={marks.mids}
                          onChange={(event) =>
                            handleMarkChange(student.id, "mids", event.target.value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={MAX_MARKS.sem}
                          value={marks.sem}
                          onChange={(event) =>
                            handleMarkChange(student.id, "sem", event.target.value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={MAX_MARKS.project}
                          value={marks.project}
                          onChange={(event) =>
                            handleMarkChange(student.id, "project", event.target.value)
                          }
                          className="w-20"
                        />
                      </TableCell>
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
    </div>
  );
}
