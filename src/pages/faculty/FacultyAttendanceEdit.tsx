import { useEffect, useMemo, useState } from "react";
import { allStudents } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

type AttendanceStatus = "present" | "absent" | "late";

const statusStyles: Record<AttendanceStatus, string> = {
  present: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  absent: "bg-red-500/10 text-red-600 border-red-500/30",
  late: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export default function FacultyAttendanceEdit() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // High-level view state
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [submittedRecords, setSubmittedRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  
  // Specific editing state
  const [editingRecordTarget, setEditingRecordTarget] = useState<{date: string, course: string} | null>(null);
  const [editingAttendance, setEditingAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const batchOptions = useMemo(
    () => {
      const batches = new Set(allStudents.filter(s => s.role === 'student' && s.batch).map(s => s.batch as string));
      return Array.from(batches).sort((a, b) => a.localeCompare(b));
    },
    [],
  );

  const batchStudents = useMemo(() => {
    if (!selectedBatch) return [];
    return allStudents.filter((student) => student.role === "student" && student.batch === selectedBatch);
  }, [selectedBatch]);

  // Fetch unique submitted records for the selected batch
  useEffect(() => {
    if (!selectedBatch) return;
    
    async function fetchSubmittedRecords() {
      setIsLoadingRecords(true);
      
      // Get unique combinations of date and course_name for this batch
      const { data, error } = await supabase
        .from('attendance')
        .select('date, course_name, created_at, status')
        .eq('batch_name', selectedBatch)
        .order('date', { ascending: false });

      if (data) {
        // Group by Date + Course Name to show as "sessions"
        const sessionsMap = new Map();
        
        data.forEach(record => {
          const key = `${record.date}__${record.course_name}`;
          if (!sessionsMap.has(key)) {
            sessionsMap.set(key, {
              date: record.date,
              course: record.course_name,
              created_at: record.created_at,
              present: 0,
              absent: 0,
              late: 0,
              total: 0
            });
          }
          const session = sessionsMap.get(key);
          session[record.status as AttendanceStatus]++;
          session.total++;
        });

        setSubmittedRecords(Array.from(sessionsMap.values()));
      }
      setIsLoadingRecords(false);
    }
    
    fetchSubmittedRecords();
    setEditingRecordTarget(null); // Reset detail view when batch changes
  }, [selectedBatch]);

  // Open the detail editor for a specific session
  const handleEditClick = async (record: any) => {
    setEditingRecordTarget({ date: record.date, course: record.course });
    
    // Fetch individual student records for this exact session
    const { data } = await supabase
      .from('attendance')
      .select('student_id, status')
      .eq('batch_name', selectedBatch)
      .eq('course_name', record.course)
      .eq('date', record.date);
      
    if (data) {
      const marks: Record<string, AttendanceStatus> = {};
      data.forEach(d => {
        marks[d.student_id] = d.status as AttendanceStatus;
      });
      setEditingAttendance(marks);
    }
  };

  const handleDeleteClick = async (record: any) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete attendance for ${record.course} on ${record.date}?`);
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('batch_name', selectedBatch)
      .eq('course_name', record.course)
      .eq('date', record.date);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Attendance record deleted successfully." });
      setSubmittedRecords(prev => prev.filter(r => !(r.date === record.date && r.course === record.course)));
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setEditingAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitEdits = async () => {
    if (!editingRecordTarget || batchStudents.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const dateStr = editingRecordTarget.date;
      const courseStr = editingRecordTarget.course;
      
      const recordsToUpsert = batchStudents.map(student => ({
        student_id: student.id,
        course_name: courseStr, 
        batch_name: selectedBatch,
        date: dateStr,
        status: editingAttendance[student.id] || 'present',
        marked_by_faculty: user?.name || 'Faculty'
      }));

      const { error } = await supabase.from('attendance').upsert(recordsToUpsert, {
        onConflict: 'student_id,date,course_name'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance updated successfully."
      });

      // Update the high-level list to reflect new counts
      const presentCount = Object.values(editingAttendance).filter(v => v === 'present').length;
      const absentCount = Object.values(editingAttendance).filter(v => v === 'absent').length;
      const lateCount = Object.values(editingAttendance).filter(v => v === 'late').length;

      setSubmittedRecords(prev => prev.map(r => {
        if (r.date === dateStr && r.course === courseStr) {
          return { ...r, present: presentCount, absent: absentCount, late: lateCount };
        }
        return r;
      }));

      // Go back to list view
      setEditingRecordTarget(null);
    } catch (error: any) {
      toast({
        title: "Update Failed",
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
          <p className="text-muted-foreground">Select a batch to see all submitted attendance history</p>
        </div>
        {editingRecordTarget && (
           <Button variant="outline" onClick={() => setEditingRecordTarget(null)}>
             Back to History List
           </Button>
        )}
      </div>

      {!editingRecordTarget ? (
        // --- LIST VIEW ---
        <div className="space-y-6">
          <div className="max-w-xs space-y-2">
            <p className="text-sm font-medium text-foreground">Select Batch</p>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch to view history" />
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

          {!selectedBatch ? (
            <div className="p-8 text-center border rounded-xl bg-card border-dashed">
              <p className="text-muted-foreground">Please select a batch to view its attendance history.</p>
            </div>
          ) : isLoadingRecords ? (
            <p className="text-sm text-muted-foreground">Loading records...</p>
          ) : submittedRecords.length === 0 ? (
            <div className="p-8 text-center border rounded-xl bg-card border-dashed">
              <p className="text-muted-foreground">No attendance records found for this batch.</p>
            </div>
          ) : (
            <div className="rounded-xl border bg-card shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-display font-semibold">Date</TableHead>
                    <TableHead className="font-display font-semibold">Course / Hour</TableHead>
                    <TableHead className="font-display font-semibold">Stats</TableHead>
                    <TableHead className="font-display font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedRecords.map((record, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {record.date}
                        </div>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      ) : (
        // --- DETAIL EDITING VIEW ---
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-muted/50 border">
            <Badge variant="outline" className="text-sm">Batch: {selectedBatch}</Badge>
            <Badge variant="outline" className="text-sm">Course: {editingRecordTarget.course}</Badge>
            <Badge variant="outline" className="text-sm">Date: {editingRecordTarget.date}</Badge>
          </div>

          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-display font-semibold">Student ID</TableHead>
                  <TableHead className="font-display font-semibold">Student Name</TableHead>
                  <TableHead className="font-display font-semibold">Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchStudents.map((student) => {
                  const status = editingAttendance[student.id] ?? "present";
                  return (
                    <TableRow key={student.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium font-mono text-sm">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Button 
                            size="sm" 
                            variant={status === "present" ? "default" : "outline"}
                            className={cn("h-8 w-14 px-0 text-xs font-medium", status === "present" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "")}
                            onClick={() => handleStatusChange(student.id, "present")}
                          >Present</Button>
                          <Button 
                            size="sm" 
                            variant={status === "absent" ? "default" : "outline"}
                            className={cn("h-8 w-14 px-0 text-xs font-medium", status === "absent" ? "bg-red-500 hover:bg-red-600 text-white" : "")}
                            onClick={() => handleStatusChange(student.id, "absent")}
                          >Absent</Button>
                          <Button 
                            size="sm" 
                            variant={status === "late" ? "default" : "outline"}
                            className={cn("h-8 w-14 px-0 text-xs font-medium", status === "late" ? "bg-amber-500 hover:bg-amber-600 text-white" : "")}
                            onClick={() => handleStatusChange(student.id, "late")}
                          >Late</Button>
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
