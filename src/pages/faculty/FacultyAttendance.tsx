import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Save, CheckCircle2, XCircle, Clock, AlertCircle, Lock } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AttendanceStatus = "present" | "absent" | "late";

interface StudentData {
  id: string;
  name: string;
  hall_ticket_no: string;
  batch_name: string;
}

interface AttendanceRow {
  student_id: string;
  status: AttendanceStatus;
  marked_by_faculty: string | null;
  date: string;
  course_name: string;
  batch_name: string;
}

interface FacultyRow {
  staff_id: string;
  name: string;
}

export default function FacultyAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [allStudents, setAllStudents] = useState<StudentData[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [courseOptions, setCourseOptions] = useState<string[]>(["Computer Networks", "Database Systems", "Operating Systems"]);
  const [selectedCourse, setSelectedCourse] = useState<string>("Computer Networks");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

  const [sessionMarkedBy, setSessionMarkedBy] = useState<string | null>(null);
  const [facultyNameMap, setFacultyNameMap] = useState<Record<string, string>>({});

  const currentFacultyIdentifier = user?.id || user?.name || "";

  const batchOptions = useMemo(() => {
    const batches = new Set(allStudents.map((student) => student.batch_name));
    return Array.from(batches).filter(Boolean).sort();
  }, [allStudents]);

  const inferredCourseFromBatch = useMemo(() => {
    if (!selectedBatch || courseOptions.length === 0) return "";

    const normalizedBatch = selectedBatch.trim();
    const prefixBeforeParen = normalizedBatch.includes("(")
      ? normalizedBatch.split("(")[0].trim()
      : normalizedBatch;

    const directMatch = courseOptions.find(
      (course) => course.toLowerCase() === prefixBeforeParen.toLowerCase(),
    );

    if (directMatch) return directMatch;

    const containsMatch = courseOptions.find((course) =>
      normalizedBatch.toLowerCase().includes(course.toLowerCase()),
    );

    return containsMatch || "";
  }, [selectedBatch, courseOptions]);

  const batchStudents = useMemo(() => {
    if (!selectedBatch) return [];
    return allStudents.filter((student) => student.batch_name === selectedBatch);
  }, [allStudents, selectedBatch]);

  const displayedStudents = useMemo(() => {
    if (!selectedBatch) return [];
    return batchStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.hall_ticket_no.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [batchStudents, selectedBatch, searchQuery]);

  const isCurrentFacultyOwner = useMemo(() => {
    if (!sessionMarkedBy) return true;
    return sessionMarkedBy === user?.id || sessionMarkedBy === user?.name;
  }, [sessionMarkedBy, user?.id, user?.name]);

  const isSessionLocked = Boolean(sessionMarkedBy) && !isCurrentFacultyOwner;

  const markedByLabel = useMemo(() => {
    if (!sessionMarkedBy) return "";
    return facultyNameMap[sessionMarkedBy] || sessionMarkedBy;
  }, [sessionMarkedBy, facultyNameMap]);

  const stats = useMemo(() => {
    const total = displayedStudents.length;
    if (total === 0) return { present: 0, absent: 0, late: 0, percentage: 0 };

    const present = displayedStudents.filter((student) => attendance[student.hall_ticket_no] === "present").length;
    const absent = displayedStudents.filter((student) => attendance[student.hall_ticket_no] === "absent").length;
    const late = displayedStudents.filter((student) => attendance[student.hall_ticket_no] === "late").length;

    return {
      total,
      present,
      absent,
      late,
      percentage: Math.round(((present + late) / total) * 100),
    };
  }, [displayedStudents, attendance]);

  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      
      const { data: facultyProfile } = await supabase
        .from("faculty")
        .select("assigned_batches")
        .eq("staff_id", user?.id)
        .single();
        
      const assignedBatches = facultyProfile?.assigned_batches || [];
      
      const [studentsRes, facultyRes, coursesRes] = await Promise.all([
        supabase.from("students").select("id, name, hall_ticket_no, batch_name"),
        supabase.from("faculty").select("staff_id, name"),
        user?.id ? supabase.from("courses").select("id, name, code, course_type").eq("faculty_id", user.id) : Promise.resolve({ data: null, error: null })
      ]);

      let allLoadedStudents: StudentData[] = [];
      if (!studentsRes.error) {
        // Only load students that belong to the assigned batches
        const allFetchedStudents = (studentsRes.data || []) as StudentData[];
        if (assignedBatches.length > 0) {
          allLoadedStudents = allFetchedStudents.filter(s => assignedBatches.includes(s.batch_name));
        } else {
          // If no batches assigned, they see nothing (or you could default to all for backward compatibility, but admin assignment implies restriction)
          allLoadedStudents = [];
          if (user?.id) {
             toast({ title: "No Batches Assigned", description: "You have not been assigned any batches by the admin.", variant: "destructive" });
          }
        }
      }

      let loadedCourseNames = ["Computer Networks", "Database Systems", "Operating Systems"];

      if (coursesRes.data && coursesRes.data.length > 0) {
        const fetchedCourseNames = coursesRes.data.map((c) => c.name);
        loadedCourseNames = Array.from(new Set([...loadedCourseNames, ...fetchedCourseNames]));
        
        // Handle elective courses batch generation
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
      setCourseOptions(loadedCourseNames);

      if (loadedCourseNames.length > 0 && !selectedCourse) {
        setSelectedCourse(loadedCourseNames[0]);
      }

      const uniqueBatches = Array.from(new Set(allLoadedStudents.map((student) => student.batch_name).filter(Boolean)));
      if (uniqueBatches.length > 0 && !selectedBatch) {
        setSelectedBatch(uniqueBatches[0] as string);
      }

      if (!facultyRes.error) {
        const map: Record<string, string> = {};
        ((facultyRes.data || []) as FacultyRow[]).forEach((row) => {
          map[row.staff_id] = row.name;
        });
        setFacultyNameMap(map);
      }

      setIsLoading(false);
    }

    if (user?.id) {
      fetchInitialData();
    }
  }, [user?.id]);

  useEffect(() => {
    async function fetchPendingRequests() {
      const { data, error } = await supabase
        .from("attendance_requests")
        .select("id, student_id, request_type, subject, request_date, reason, status, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        if (error.code !== "PGRST205" && error.code !== "42P01") {
          toast({ title: "Failed to load attendance requests", description: error.message, variant: "destructive" });
        }
        return;
      }

      setPendingRequests(data || []);
    }

    fetchPendingRequests();

    const channel = supabase
      .channel(`faculty-attendance-requests-${user?.id || "unknown"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance_requests" },
        () => fetchPendingRequests(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!selectedBatch || !selectedCourse || !selectedDate) return;

    async function loadAttendance() {
      const { data, error } = await supabase
        .from("attendance")
        .select("student_id, status, marked_by_faculty, date, course_name, batch_name")
        .eq("batch_name", selectedBatch)
        .eq("course_name", selectedCourse)
        .eq("date", selectedDate);

      if (error) {
        toast({ title: "Failed to load attendance", description: error.message, variant: "destructive" });
        return;
      }

      const map: Record<string, AttendanceStatus> = {};
      batchStudents.forEach((student) => {
        map[student.hall_ticket_no] = "present";
      });

      const records = (data || []) as AttendanceRow[];
      records.forEach((record) => {
        map[record.student_id] = record.status;
      });

      const owner = records.find((record) => record.marked_by_faculty)?.marked_by_faculty || null;
      setSessionMarkedBy(owner);
      setAttendance(map);
    }

    loadAttendance();

    const channelId = `attendance_${selectedBatch}_${selectedCourse}_${selectedDate}_${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
          filter: `batch_name=eq.${selectedBatch}`,
        },
        async (payload) => {
          const newRecord = payload.new as AttendanceRow | null;
          if (!newRecord) return;
          if (newRecord.date !== selectedDate || newRecord.course_name !== selectedCourse) return;

          setAttendance((prev) => ({
            ...prev,
            [newRecord.student_id]: newRecord.status,
          }));

          const ownerRes = await supabase
            .from("attendance")
            .select("marked_by_faculty")
            .eq("batch_name", selectedBatch)
            .eq("course_name", selectedCourse)
            .eq("date", selectedDate)
            .not("marked_by_faculty", "is", null)
            .limit(1)
            .maybeSingle();

          if (!ownerRes.error) {
            setSessionMarkedBy(ownerRes.data?.marked_by_faculty || null);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedBatch, selectedCourse, selectedDate, batchStudents.length]);

  useEffect(() => {
    if (!selectedBatch) return;
    if (!inferredCourseFromBatch) return;
    if (selectedCourse === inferredCourseFromBatch) return;
    setSelectedCourse(inferredCourseFromBatch);
  }, [selectedBatch, inferredCourseFromBatch, selectedCourse]);

  const handleRequestDecision = async (requestId: string, status: "approved" | "rejected") => {
    setProcessingRequestId(requestId);
    try {
      const { error } = await supabase
        .from("attendance_requests")
        .update({ status, reviewed_by: user?.id || null, reviewed_at: new Date().toISOString() })
        .eq("id", requestId);

      if (error) throw error;

      toast({ title: `Request ${status}`, description: `Attendance request has been ${status}.` });
      setPendingRequests((prev) => prev.filter((item) => item.id !== requestId));
    } catch (error: any) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (isSessionLocked) {
      toast({
        title: "Attendance already marked",
        description: `This session is marked by ${markedByLabel}. You can only view it.`,
        variant: "destructive",
      });
      return;
    }
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleBulkChange = (status: AttendanceStatus) => {
    if (isSessionLocked) {
      toast({
        title: "Attendance already marked",
        description: `This session is marked by ${markedByLabel}. You can only view it.`,
        variant: "destructive",
      });
      return;
    }
    const next = { ...attendance };
    displayedStudents.forEach((student) => {
      next[student.hall_ticket_no] = status;
    });
    setAttendance(next);
  };

  const handleSubmit = async () => {
    if (!selectedBatch || !selectedCourse || !selectedDate) return;

    setIsSubmitting(true);
    try {
      const existingSession = await supabase
        .from("attendance")
        .select("marked_by_faculty")
        .eq("batch_name", selectedBatch)
        .eq("course_name", selectedCourse)
        .eq("date", selectedDate)
        .not("marked_by_faculty", "is", null)
        .limit(1)
        .maybeSingle();

      if (existingSession.error) throw existingSession.error;

      const owner = existingSession.data?.marked_by_faculty || null;
      const isOwnedByCurrent = !owner || owner === user?.id || owner === user?.name;

      if (!isOwnedByCurrent) {
        const ownerText = facultyNameMap[owner] || owner;
        toast({
          title: "Attendance already completed",
          description: `This batch attendance is already marked by ${ownerText}.`,
          variant: "destructive",
        });
        setSessionMarkedBy(owner);
        return;
      }

      const marker = owner || currentFacultyIdentifier || "Faculty";

      const records = batchStudents.map((student) => ({
        student_id: student.hall_ticket_no,
        batch_name: selectedBatch,
        course_name: selectedCourse,
        date: selectedDate,
        status: attendance[student.hall_ticket_no] || "present",
        marked_by_faculty: marker,
      }));

      const { error } = await supabase
        .from("attendance")
        .upsert(records, { onConflict: "student_id, date, course_name" });

      if (error) throw error;

      setSessionMarkedBy(marker);
      toast({ title: "Success", description: "Attendance saved successfully." });
    } catch (error: any) {
      toast({ title: "Submission error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Live System Attendance
          </h1>
          <p className="text-muted-foreground mt-1">Real-time synchronization across devices and enterprise tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <span className="text-sm font-medium text-success">Synced</span>
        </div>
      </div>

      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Batch / Section</label>
            <Select value={selectedBatch} onValueChange={setSelectedBatch} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Select Batch" /></SelectTrigger>
              <SelectContent>
                {batchOptions.length === 0 && <SelectItem value="empty" disabled>Loading...</SelectItem>}
                {batchOptions.map((batch) => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {courseOptions.map((courseName) => (
                  <SelectItem key={courseName} value={courseName}>{courseName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="By Name or Hall Ticket"
                className="pl-8"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {sessionMarkedBy && (
        <Card className={cn("border", isSessionLocked ? "border-destructive/40" : "border-success/40")}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-2 text-sm">
              <Lock className={cn("h-4 w-4 mt-0.5", isSessionLocked ? "text-destructive" : "text-success")} />
              <div>
                <p className="font-medium">
                  Attendance already marked by {markedByLabel}.
                </p>
                <p className="text-muted-foreground">
                  {isSessionLocked
                    ? "You can view this attendance but cannot change or submit it."
                    : "You can continue editing because this session was marked by you."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedBatch && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 border-border shadow-sm">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between bg-muted/20">
              <div>
                <CardTitle className="text-lg">Class Roster</CardTitle>
                <CardDescription>Records automatically pre-filled and sync live</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 shadow-sm"
                  onClick={() => handleBulkChange("present")}
                  disabled={isSessionLocked}
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-success" /> All Present
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 shadow-sm"
                  onClick={() => handleBulkChange("absent")}
                  disabled={isSessionLocked}
                >
                  <XCircle className="mr-1.5 h-3.5 w-3.5 text-destructive" /> All Absent
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="w-[60px] pl-6 text-xs upper">Sl No</TableHead>
                    <TableHead className="text-xs upper">Hall Ticket</TableHead>
                    <TableHead className="text-xs upper">Name</TableHead>
                    <TableHead className="text-right pr-6 text-xs upper">Action Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No students in this view.</TableCell>
                    </TableRow>
                  ) : (
                    displayedStudents.map((student, index) => {
                      const status = attendance[student.hall_ticket_no] || "present";
                      return (
                        <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="pl-6 font-medium text-muted-foreground/60">{index + 1}</TableCell>
                          <TableCell className="font-mono text-sm">{student.hall_ticket_no}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="pr-6">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant={status === "present" ? "default" : "outline"}
                                className={cn(
                                  "h-7 px-3 text-xs w-[80px]",
                                  status === "present" && "bg-success/90 hover:bg-success text-white border-transparent",
                                )}
                                onClick={() => handleStatusChange(student.hall_ticket_no, "present")}
                                disabled={isSessionLocked}
                              >
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant={status === "absent" ? "default" : "outline"}
                                className={cn(
                                  "h-7 px-3 text-xs w-[80px]",
                                  status === "absent" && "bg-destructive/90 hover:bg-destructive text-white border-transparent",
                                )}
                                onClick={() => handleStatusChange(student.hall_ticket_no, "absent")}
                                disabled={isSessionLocked}
                              >
                                Absent
                              </Button>
                              <Button
                                size="sm"
                                variant={status === "late" ? "default" : "outline"}
                                className={cn(
                                  "h-7 px-3 text-xs w-[80px]",
                                  status === "late" && "bg-warning/90 hover:bg-warning text-white border-transparent",
                                )}
                                onClick={() => handleStatusChange(student.hall_ticket_no, "late")}
                                disabled={isSessionLocked}
                              >
                                Late
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2 border-b bg-muted/20">
                <CardTitle className="text-sm font-medium">Session Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10 mb-6">
                  <span className="text-6xl font-bold tracking-tighter text-primary drop-shadow-sm">
                    {stats.percentage}<span className="text-3xl">%</span>
                  </span>
                  <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider mt-2">Class Attendance</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-success/5 transition-colors">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success" /> Present</span>
                    <span className="font-bold text-base">{stats.present}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-destructive/5 transition-colors">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground"><XCircle className="h-4 w-4 text-destructive" /> Absent</span>
                    <span className="font-bold text-base">{stats.absent}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-warning/5 transition-colors">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground"><Clock className="h-4 w-4 text-warning" /> Late</span>
                    <span className="font-bold text-base">{stats.late}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              onClick={handleSubmit}
              disabled={isSubmitting || displayedStudents.length === 0 || isSessionLocked}
            >
              {isSubmitting ? (
                <><AlertCircle className="mr-2 h-5 w-5 animate-pulse" /> Saving...</>
              ) : isSessionLocked ? (
                <><Lock className="mr-2 h-5 w-5" /> Locked</>
              ) : (
                <><Save className="mr-2 h-5 w-5" /> Save Attendance</>
              )}
            </Button>
          </div>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-lg">Attendance Requests Awaiting Approval</CardTitle>
          <CardDescription>Leave and correction requests submitted by students</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-medium capitalize">{request.request_type} • {request.subject || "General"}</p>
                      <p className="text-sm text-muted-foreground">Student: {request.student_id} • Date: {request.request_date || "N/A"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90 text-white"
                        onClick={() => handleRequestDecision(request.id, "approved")}
                        disabled={processingRequestId === request.id}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRequestDecision(request.id, "rejected")}
                        disabled={processingRequestId === request.id}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  {request.reason && <p className="text-sm mt-2 text-muted-foreground">{request.reason}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
