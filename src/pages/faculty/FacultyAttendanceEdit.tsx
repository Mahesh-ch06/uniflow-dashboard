import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, CalendarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AttendanceStatus = "present" | "absent" | "late";

interface StudentRow {
  id: string;
  name: string;
  hall_ticket_no: string;
  batch_name: string;
}

interface AttendanceRow {
  student_id: string;
  course_name: string;
  batch_name: string;
  date: string;
  status: AttendanceStatus;
  marked_by_faculty: string | null;
  created_at: string;
}

interface SessionRecord {
  date: string;
  batch: string;
  course: string;
  markedBy: string | null;
  present: number;
  absent: number;
  late: number;
  total: number;
  createdAt: string;
}

export default function FacultyAttendanceEdit() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [allStudents, setAllStudents] = useState<StudentRow[]>([]);

  const [submittedRecords, setSubmittedRecords] = useState<SessionRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  const [editingRecordTarget, setEditingRecordTarget] = useState<{ date: string; course: string; batch: string; markedBy: string | null } | null>(null);
  const [editingAttendance, setEditingAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentFacultyId = user?.id || "";
  const currentFacultyName = user?.name || "";
  const today = new Date().toISOString().split("T")[0];

  const batchStudents = useMemo(() => {
    if (!editingRecordTarget?.batch) return [];
    return allStudents.filter((student) => student.batch_name === editingRecordTarget.batch);
  }, [allStudents, editingRecordTarget?.batch]);

  useEffect(() => {
    async function fetchBaseData() {
      const { data: facultyProfile } = await supabase
        .from("faculty")
        .select("assigned_batches")
        .eq("staff_id", currentFacultyId)
        .single();
        
      const assignedBatches = facultyProfile?.assigned_batches || [];
      
      const [studentsRes, coursesRes] = await Promise.all([
        supabase.from("students").select("id, name, hall_ticket_no, batch_name"),
        currentFacultyId ? supabase.from("courses").select("id, name, code, course_type").eq("faculty_id", currentFacultyId) : Promise.resolve({ data: null, error: null })
      ]);

      let allLoadedStudents: StudentRow[] = [];

      if (studentsRes.error) {
        toast({ title: "Failed to load students", description: studentsRes.error.message, variant: "destructive" });
      } else {
        const allFetchedStudents = (studentsRes.data || []) as StudentRow[];
        if (assignedBatches.length > 0) {
          allLoadedStudents = allFetchedStudents.filter(s => assignedBatches.includes(s.batch_name));
        } else {
          allLoadedStudents = [];
        }
      }

      if (coursesRes.data && coursesRes.data.length > 0) {
        const electiveCourses = coursesRes.data.filter((c) => c.course_type === "elective");
        if (electiveCourses.length > 0) {
          const courseIds = electiveCourses.map((c) => c.id);
          const { data: enrollments } = await supabase
            .from("student_courses")
            .select("student_id, course_id, students(name, batch_name)")
            .in("course_id", courseIds);

          if (enrollments && enrollments.length > 0) {
            for (const course of electiveCourses) {
              const courseEnrollments = enrollments.filter((e) => e.course_id === course.id);
              if (courseEnrollments.length === 0) continue;

              const batches = new Set(
                courseEnrollments
                  .map((e) => (e.students as any)?.batch_name)
                  .filter(Boolean)
              );
              
              const combinedBatchName = `${course.name}(${Array.from(batches).join(", ")})`;
              
              courseEnrollments.forEach((e) => {
                allLoadedStudents.push({
                  id: `${e.student_id}_${course.id}`,
                  hall_ticket_no: e.student_id,
                  name: (e.students as any)?.name || "Unknown",
                  batch_name: combinedBatchName,
                });
              });
            }
          }
        }
      }

      setAllStudents(allLoadedStudents);
    }

    if (currentFacultyId) {
      fetchBaseData();
    }
  }, [currentFacultyId]);

  useEffect(() => {
    if (!currentFacultyId && !currentFacultyName) return;

    async function fetchSubmittedRecords() {
      setIsLoadingRecords(true);

      const filterId = currentFacultyId.toLowerCase();
      const filterName = currentFacultyName.toLowerCase();

      // Only fetch records marked by the currently logged-in faculty
      const { data, error } = await supabase
        .from("attendance")
        .select("date, course_name, batch_name, created_at, status, marked_by_faculty")
        .or(`marked_by_faculty.ilike.${filterId},marked_by_faculty.ilike.${filterName}`)
        .order("date", { ascending: false });

      if (error) {
        toast({ title: "Failed to load history", description: error.message, variant: "destructive" });
        setIsLoadingRecords(false);
        return;
      }

      const sessionsMap = new Map<string, SessionRecord>();

      ((data || []) as AttendanceRow[]).forEach((record) => {
        const key = `${record.date}__${record.course_name}__${record.batch_name}`;
        if (!sessionsMap.has(key)) {
          sessionsMap.set(key, {
            date: record.date,
            batch: record.batch_name,
            course: record.course_name,
            markedBy: record.marked_by_faculty,
            createdAt: record.created_at,
            present: 0,
            absent: 0,
            late: 0,
            total: 0,
          });
        }

        const session = sessionsMap.get(key)!;
        session[record.status] += 1;
        session.total += 1;

        if (!session.markedBy && record.marked_by_faculty) {
          session.markedBy = record.marked_by_faculty;
        }
        if (record.created_at > session.createdAt) {
          session.createdAt = record.created_at;
        }
      });

      const sorted = Array.from(sessionsMap.values()).sort((a, b) => {
        const aTodayRank = a.date === today ? 0 : 1;
        const bTodayRank = b.date === today ? 0 : 1;
        if (aTodayRank !== bTodayRank) return aTodayRank - bTodayRank;

        const byDate = b.date.localeCompare(a.date);
        if (byDate !== 0) return byDate;

        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });

      setSubmittedRecords(sorted);
      setIsLoadingRecords(false);
    }

    fetchSubmittedRecords();
    setEditingRecordTarget(null);
  }, [currentFacultyId, currentFacultyName]);

  const handleEditClick = async (record: SessionRecord) => {
    setEditingRecordTarget({
      date: record.date,
      course: record.course,
      batch: record.batch,
      markedBy: record.markedBy,
    });

    const { data, error } = await supabase
      .from("attendance")
      .select("student_id, status")
      .eq("batch_name", record.batch)
      .eq("course_name", record.course)
      .eq("date", record.date);

    if (error) {
      toast({ title: "Failed to load session", description: error.message, variant: "destructive" });
      return;
    }

    const marks: Record<string, AttendanceStatus> = {};
    (data || []).forEach((row: any) => {
      marks[row.student_id] = row.status as AttendanceStatus;
    });

    setEditingAttendance(marks);
  };

  const handleDeleteClick = async (record: SessionRecord) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete attendance for ${record.course} (${record.batch}) on ${record.date}?`);
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("batch_name", record.batch)
      .eq("course_name", record.course)
      .eq("date", record.date);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Deleted", description: "Attendance record deleted successfully." });
    setSubmittedRecords((prev) => prev.filter((item) => !(item.date === record.date && item.course === record.course && item.batch === record.batch)));
  };

  const handleStatusChange = (studentHallTicket: string, status: AttendanceStatus) => {
    setEditingAttendance((prev) => ({
      ...prev,
      [studentHallTicket]: status,
    }));
  };

  const handleSubmitEdits = async () => {
    if (!editingRecordTarget || batchStudents.length === 0) return;

    setIsSubmitting(true);
    try {
      const dateStr = editingRecordTarget.date;
      const courseStr = editingRecordTarget.course;
      const batchStr = editingRecordTarget.batch;
      const marker = editingRecordTarget.markedBy || currentFacultyId || user?.name || "Faculty";

      const recordsToUpsert = batchStudents.map((student) => ({
        student_id: student.hall_ticket_no,
        course_name: courseStr,
        batch_name: batchStr,
        date: dateStr,
        status: editingAttendance[student.hall_ticket_no] || "present",
        marked_by_faculty: marker,
      }));

        // Ensure elective composite batch names exist in DB to satisfy foreign keys
      try {
        await supabase.from("batches").upsert({ name: batchStr }, { onConflict: "name" });
      } catch (err) {
        console.warn("Could not insert batch name placeholder:", err);
      }

      const { error } = await supabase.from("attendance").upsert(recordsToUpsert, {
        onConflict: "student_id,date,course_name",
      });

      const presentCount = Object.values(editingAttendance).filter((value) => value === "present").length;
      const absentCount = Object.values(editingAttendance).filter((value) => value === "absent").length;
      const lateCount = Object.values(editingAttendance).filter((value) => value === "late").length;

      setSubmittedRecords((prev) =>
        prev.map((item) => {
          if (item.date === dateStr && item.course === courseStr && item.batch === batchStr) {
            return {
              ...item,
              present: presentCount,
              absent: absentCount,
              late: lateCount,
              markedBy: marker,
            };
          }
          return item;
        }),
      );

      setEditingRecordTarget(null);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Edit & View Attendance</h1>
          <p className="text-muted-foreground">Your recent attendance submissions (today first)</p>
        </div>
        {editingRecordTarget && (
          <Button variant="outline" onClick={() => setEditingRecordTarget(null)}>
            Back to History List
          </Button>
        )}
      </div>

      {!editingRecordTarget ? (
        <div className="space-y-6">
          {isLoadingRecords ? (
            <p className="text-sm text-muted-foreground">Loading your attendance records...</p>
          ) : submittedRecords.length === 0 ? (
            <div className="p-8 text-center border rounded-xl bg-card border-dashed">
              <p className="text-muted-foreground">You haven't submitted any attendance records yet.</p>
            </div>
          ) : (
            <div className="rounded-xl border bg-card shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-display font-semibold">Date</TableHead>
                    <TableHead className="font-display font-semibold">Batch</TableHead>
                    <TableHead className="font-display font-semibold">Course / Hour</TableHead>
                    <TableHead className="font-display font-semibold">Stats</TableHead>
                    <TableHead className="font-display font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedRecords.map((record, index) => {
                    return (
                      <TableRow key={`${record.date}-${record.course}-${record.batch}-${index}`} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            {record.date}
                            {record.date === today && <Badge variant="secondary">Today</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {record.batch}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.course}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 text-xs font-medium">
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">P: {record.present}</span>
                            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">A: {record.absent}</span>
                            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded">L: {record.late}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="secondary" className="h-8" onClick={() => handleEditClick(record)}>
                              <Edit2 className="h-4 w-4 mr-1.5" />
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8" onClick={() => handleDeleteClick(record)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-muted/50 border">
            <Badge variant="outline" className="text-sm">Batch: {editingRecordTarget.batch}</Badge>
            <Badge variant="outline" className="text-sm">Course: {editingRecordTarget.course}</Badge>
            <Badge variant="outline" className="text-sm">Date: {editingRecordTarget.date}</Badge>
            <Badge variant="outline" className="text-sm">Instructor: {user?.name || editingRecordTarget.markedBy}</Badge>
          </div>

          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-display font-semibold">Hall Ticket</TableHead>
                  <TableHead className="font-display font-semibold">Student Name</TableHead>
                  <TableHead className="font-display font-semibold">Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchStudents.map((student) => {
                  const status = editingAttendance[student.hall_ticket_no] ?? "present";
                  return (
                    <TableRow key={student.hall_ticket_no} className="hover:bg-muted/30">
                      <TableCell className="font-medium font-mono text-sm">{student.hall_ticket_no}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant={status === "present" ? "default" : "outline"}
                            className={cn("h-8 w-14 px-0 text-xs font-medium", status === "present" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "")}
                            onClick={() => handleStatusChange(student.hall_ticket_no, "present")}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={status === "absent" ? "default" : "outline"}
                            className={cn("h-8 w-14 px-0 text-xs font-medium", status === "absent" ? "bg-red-500 hover:bg-red-600 text-white" : "")}
                            onClick={() => handleStatusChange(student.hall_ticket_no, "absent")}
                          >
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={status === "late" ? "default" : "outline"}
                            className={cn("h-8 w-14 px-0 text-xs font-medium", status === "late" ? "bg-amber-500 hover:bg-amber-600 text-white" : "")}
                            onClick={() => handleStatusChange(student.hall_ticket_no, "late")}
                          >
                            Late
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={handleSubmitEdits} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
