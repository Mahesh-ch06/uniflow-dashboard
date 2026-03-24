import { useEffect, useMemo, useState } from "react";
import { allStudents, timetable } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AttendanceStatus = "present" | "absent" | "late";

const statusStyles: Record<AttendanceStatus, string> = {
  present: "bg-success/10 text-success border-success/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
  late: "bg-warning/10 text-warning border-warning/30",
};

export default function FacultyAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceByContext, setAttendanceByContext] = useState<Record<string, Record<string, AttendanceStatus>>>({});
  const [submittedByContext, setSubmittedByContext] = useState<Record<string, boolean>>({});
  const [editingByContext, setEditingByContext] = useState<Record<string, boolean>>({});

  const [existingStatusByStudent, setExistingStatusByStudent] = useState<Record<string, AttendanceStatus>>({});

  const batchOptions = useMemo(
    () => {
      const batches = new Set(allStudents.filter(s => s.role === 'student' && s.batch).map(s => s.batch as string));
      return Array.from(batches).sort((a, b) => a.localeCompare(b));
    },
    [],
  );

  const hourOptions = useMemo(
    () => [...new Set(timetable.map((item) => item.startTime))].sort((a, b) => a.localeCompare(b)),
    [],
  );

  const selectedContextKey = useMemo(
    () => (selectedBatch && selectedHour ? `${selectedBatch}__${selectedHour}` : ""),
    [selectedBatch, selectedHour],
  );

  const batchStudents = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }
    return allStudents.filter((student) => student.role === "student" && student.batch === selectedBatch);
  }, [selectedBatch]);

  // Fetch already submitted records from db for given day/batch 
  useEffect(() => {
    if (!selectedBatch || !selectedHour) return;
    
    async function fetchExistingAttendance() {
      const dateStr = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('batch_name', selectedBatch)
        .eq('course_name', selectedBatch) // using selectedBatch as course_name temporarily
        .eq('date', dateStr);

      if (data && data.length > 0) {
        const fetchedMarks: Record<string, AttendanceStatus> = {};
        data.forEach(record => {
          fetchedMarks[record.student_id] = record.status as AttendanceStatus;
        });

        setAttendanceByContext((prev) => ({ ...prev, [selectedContextKey]: fetchedMarks }));
        setSubmittedByContext((prev) => ({ ...prev, [selectedContextKey]: true }));
        setEditingByContext((prev) => ({ ...prev, [selectedContextKey]: false }));
      } else {
        // Init with null or default 'present' if new
        const initialMarks: Record<string, AttendanceStatus> = {};
        batchStudents.forEach((student) => {
          initialMarks[student.id] = "present";
        });
        setAttendanceByContext((prev) => ({ ...prev, [selectedContextKey]: initialMarks }));
        setSubmittedByContext((prev) => ({ ...prev, [selectedContextKey]: false }));
      }
    }
    
    fetchExistingAttendance();
  }, [selectedBatch, selectedHour, selectedContextKey, batchStudents]);

  const selectedAttendance = selectedContextKey ? attendanceByContext[selectedContextKey] ?? {} : {};
  const isSubmitted = selectedContextKey ? Boolean(submittedByContext[selectedContextKey]) : false;
  const isEditing = selectedContextKey ? Boolean(editingByContext[selectedContextKey]) : false;
  const canEditRows = !isSubmitted || isEditing;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (!selectedContextKey || !canEditRows) {
      return;
    }

    setAttendanceByContext((prev) => ({
      ...prev,
      [selectedContextKey]: {
        ...(prev[selectedContextKey] ?? {}),
        [studentId]: status,
      },
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedContextKey || batchStudents.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const attendanceData = { ...selectedAttendance };
      const dateStr = new Date().toISOString().split('T')[0];
      
      // Auto-absent rule: if student has 3 consecutive lates, 4th time becomes absent
      const studentsMarkedLate = batchStudents.filter(s => (attendanceData[s.id] || 'present') === 'late');
      
      if (studentsMarkedLate.length > 0) {
        const { data: recentHistory } = await supabase
          .from('attendance')
          .select('student_id, status, date')
          .in('student_id', studentsMarkedLate.map(s => s.id))
          .order('date', { ascending: false });
          
        if (recentHistory) {
          for (const student of studentsMarkedLate) {
            const history = recentHistory.filter(r => r.student_id === student.id && r.date < dateStr);
            let prevLates = 0;
            for (const record of history) {
              if (record.status === 'late') {
                prevLates++;
              } else {
                break;
              }
            }
            if (prevLates >= 3) {
              attendanceData[student.id] = 'absent';
              toast({
                title: "Attendance Override",
                description: `${student.name} was changed to Absent due to 3 prior consecutive lates.`,
                variant: "destructive"
              });
            }
          }
        }
      }

      const recordsToUpsert = batchStudents.map(student => ({
        student_id: student.id,
        course_name: selectedBatch, 
        batch_name: selectedBatch,
        date: dateStr,
        status: attendanceData[student.id] || 'present',
        marked_by_faculty: user?.name || 'Faculty'
      }));

      const { error } = await supabase.from('attendance').upsert(recordsToUpsert, {
        onConflict: 'student_id,date,course_name'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance marked successfully for " + selectedBatch,
      });

      // Update local state to reflect any overrides (like auto-absent)
      setAttendanceByContext((prev) => ({
        ...prev,
        [selectedContextKey]: attendanceData,
      }));
      setSubmittedByContext((prev) => ({ ...prev, [selectedContextKey]: true }));
      setEditingByContext((prev) => ({ ...prev, [selectedContextKey]: false }));
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAttendance = () => {
    if (!selectedContextKey) {
      return;
    }

    setEditingByContext((prev) => ({ ...prev, [selectedContextKey]: true }));
  };

  const presentCount = Object.values(selectedAttendance).filter((value) => value === "present").length;
  const absentCount = Object.values(selectedAttendance).filter((value) => value === "absent").length;
  const lateCount = Object.values(selectedAttendance).filter((value) => value === "late").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Mark Attendance</h1>
        <p className="text-muted-foreground">Select batch and hour, mark present/absent, then submit attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Batch</p>
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch" />
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
          <p className="text-sm font-medium text-foreground">Hour</p>
          <Select value={selectedHour} onValueChange={setSelectedHour}>
            <SelectTrigger>
              <SelectValue placeholder="Select hour" />
            </SelectTrigger>
            <SelectContent>
              {hourOptions.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedBatch || !selectedHour ? (
        <p className="text-sm text-muted-foreground">Choose both batch and hour to start marking attendance.</p>
      ) : batchStudents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No students found for the selected batch.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className={cn("capitalize", statusStyles.present)}>
              Present: {presentCount}
            </Badge>
            <Badge variant="outline" className={cn("capitalize", statusStyles.absent)}>
              Absent: {absentCount}
            </Badge>
            <Badge variant="outline" className={cn("capitalize", statusStyles.late)}>
              Late: {lateCount}
            </Badge>
            {isSubmitted && !isEditing && <Badge variant="secondary">Attendance Submitted</Badge>}
          </div>

          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-display font-semibold text-foreground">Student ID</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Student</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Department</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Batch</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchStudents.map((student) => {
                  const status = selectedAttendance[student.id] ?? "present";

                  return (
                    <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{selectedBatch}</TableCell>
                      <TableCell>
                        {canEditRows ? (
                          <div className="flex items-center gap-1.5">
                            <Button 
                              size="sm" 
                              variant={status === "present" ? "default" : "outline"}
                              className={cn(
                                "h-8 w-11 px-0 text-xs font-medium cursor-pointer transition-colors", 
                                status === "present" 
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent" 
                                  : "text-muted-foreground hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
                              )}
                              onClick={() => handleStatusChange(student.id, "present")}
                              title="Present"
                            >
                              P
                            </Button>
                            <Button 
                              size="sm" 
                              variant={status === "absent" ? "default" : "outline"}
                              className={cn(
                                "h-8 w-11 px-0 text-xs font-medium cursor-pointer transition-colors", 
                                status === "absent" 
                                  ? "bg-red-500 hover:bg-red-600 text-white border-transparent" 
                                  : "text-muted-foreground hover:text-red-600 hover:border-red-300 hover:bg-red-50"
                              )}
                              onClick={() => handleStatusChange(student.id, "absent")}
                              title="Absent"
                            >
                              A
                            </Button>
                            <Button 
                              size="sm" 
                              variant={status === "late" ? "default" : "outline"}
                              className={cn(
                                "h-8 w-11 px-0 text-xs font-medium cursor-pointer transition-colors", 
                                status === "late" 
                                  ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent" 
                                  : "text-muted-foreground hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50"
                              )}
                              onClick={() => handleStatusChange(student.id, "late")}
                              title="Late"
                            >
                              L
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="outline" className={cn("capitalize", statusStyles[status])}>
                            {status}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center gap-3">
            {isSubmitted && !isEditing ? (
              <Button type="button" variant="outline" onClick={handleEditAttendance}>
                Edit Attendance
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmitAttendance} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : isEditing ? "Save Changes" : "Submit Attendance"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
