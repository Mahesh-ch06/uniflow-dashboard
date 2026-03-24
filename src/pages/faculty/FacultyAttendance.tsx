import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Save, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
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

export default function FacultyAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data states
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("Computer Networks");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Attendance state mapping hall_ticket_no -> status
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  
  // Filters & Derived state
  const batchOptions = useMemo(() => {
    const batches = new Set(allStudents.map(s => s.batch_name));
    return Array.from(batches).filter(Boolean).sort();
  }, [allStudents]);

  const displayedStudents = useMemo(() => {
    if (!selectedBatch) return [];
    return allStudents.filter(s => 
      s.batch_name === selectedBatch && 
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.hall_ticket_no.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allStudents, selectedBatch, searchQuery]);

  const stats = useMemo(() => {
    const total = displayedStudents.length;
    if (total === 0) return { present: 0, absent: 0, late: 0, percentage: 0 };
    const present = displayedStudents.filter(s => attendance[s.hall_ticket_no] === 'present').length;
    const absent = displayedStudents.filter(s => attendance[s.hall_ticket_no] === 'absent').length;
    const late = displayedStudents.filter(s => attendance[s.hall_ticket_no] === 'late').length;
    return { total, present, absent, late, percentage: Math.round(((present + late) / total) * 100) };
  }, [displayedStudents, attendance]);

  // Load Students
  useEffect(() => {
    async function fetchStudents() {
      setIsLoading(true);
      const { data, error } = await supabase.from('students').select('*');
      if (error) {
        toast({ title: "Error loading students", description: error.message, variant: "destructive" });
      } else {
        setAllStudents(data || []);
        const uniqueBatches = Array.from(new Set(data?.map(s => s.batch_name).filter(Boolean)));
        if (uniqueBatches.length > 0 && !selectedBatch) setSelectedBatch(uniqueBatches[0] as string);
      }
      setIsLoading(false);
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    async function fetchPendingRequests() {
      const { data, error } = await supabase
        .from('attendance_requests')
        .select('id, student_id, request_type, subject, request_date, reason, status, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        if (error.code !== 'PGRST205' && error.code !== '42P01') {
          toast({ title: 'Failed to load attendance requests', description: error.message, variant: 'destructive' });
        }
        return;
      }

      setPendingRequests(data || []);
    }

    fetchPendingRequests();

    const channel = supabase
      .channel(`faculty-attendance-requests-${user?.id || 'unknown'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_requests' },
        () => fetchPendingRequests(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleRequestDecision = async (requestId: string, status: 'approved' | 'rejected') => {
    setProcessingRequestId(requestId);
    try {
      const { error } = await supabase
        .from('attendance_requests')
        .update({ status, reviewed_by: user?.id || null, reviewed_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      toast({ title: `Request ${status}`, description: `Attendance request has been ${status}.` });
      setPendingRequests((prev) => prev.filter((item) => item.id !== requestId));
    } catch (error: any) {
      toast({ title: 'Action failed', description: error.message, variant: 'destructive' });
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Fetch & Subscribe to Attendance in Real-time
  useEffect(() => {
    if (!selectedBatch || !selectedCourse || !selectedDate) return;
    
    async function loadAttendance() {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('batch_name', selectedBatch)
        .eq('course_name', selectedCourse)
        .eq('date', selectedDate);

      // Default all to present first
      const attMap: Record<string, AttendanceStatus> = {};
      displayedStudents.forEach(s => attMap[s.hall_ticket_no] = "present");
      
      if (data && data.length > 0) {
        data.forEach(record => {
          attMap[record.student_id] = record.status as AttendanceStatus;
        });
      }
      setAttendance(attMap);
    }

    loadAttendance();

    // Realtime subscription
    const channelId = `attendance_${selectedBatch}_${Date.now()}`;
    const channel = supabase.channel(channelId)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'attendance', 
          filter: `batch_name=eq.${selectedBatch}` 
        }, 
        (payload) => {
          const newRecord = payload.new as any;
          if (newRecord && newRecord.date === selectedDate && newRecord.course_name === selectedCourse) {
            setAttendance(prev => ({ ...prev, [newRecord.student_id]: newRecord.status as AttendanceStatus }));
          }
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedBatch, selectedCourse, selectedDate, displayedStudents.length]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleBulkChange = (status: AttendanceStatus) => {
    const newAtt = { ...attendance };
    displayedStudents.forEach(s => newAtt[s.hall_ticket_no] = status);
    setAttendance(newAtt);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const records = displayedStudents.map(student => ({
        student_id: student.hall_ticket_no,
        batch_name: selectedBatch,
        course_name: selectedCourse,
        date: selectedDate,
        status: attendance[student.hall_ticket_no] || 'present'
      }));

      const { error } = await supabase.from('attendance').upsert(records, { onConflict: 'student_id, date, course_name' });
      if (error) throw error;
      toast({ title: "Success", description: "Attendance pushed to live systems." });
    } catch (error: any) {
      toast({ title: "Submission Error", description: error.message, variant: "destructive" });
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
          <p className="text-muted-foreground mt-1">
            Real-time synchronization across devices and enterprise tracking.
          </p>
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
                {batchOptions.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                <SelectItem value="Database Systems">Database Systems</SelectItem>
                <SelectItem value="Operating Systems">Operating Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="By Name or Hall Ticket" className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedBatch && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 border-border shadow-sm">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between bg-muted/20">
              <div>
                <CardTitle className="text-lg">Class Roster</CardTitle>
                <CardDescription>Records automatically pre-filled and sync live</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 shadow-sm" onClick={() => handleBulkChange('present')}>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-success" /> All Present
                </Button>
                <Button size="sm" variant="outline" className="h-8 shadow-sm" onClick={() => handleBulkChange('absent')}>
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
                    displayedStudents.map((student, idx) => {
                      const status = attendance[student.hall_ticket_no] || 'present';
                      return (
                        <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="pl-6 font-medium text-muted-foreground/60">{idx + 1}</TableCell>
                          <TableCell className="font-mono text-sm">{student.hall_ticket_no}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="pr-6">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant={status === "present" ? "default" : "outline"}
                                className={cn("h-7 px-3 text-xs w-[80px]", status === "present" && "bg-success/90 hover:bg-success text-white border-transparent")}
                                onClick={() => handleStatusChange(student.hall_ticket_no, "present")}
                              >Present</Button>
                              <Button
                                size="sm"
                                variant={status === "absent" ? "default" : "outline"}
                                className={cn("h-7 px-3 text-xs w-[80px]", status === "absent" && "bg-destructive/90 hover:bg-destructive text-white border-transparent")}
                                onClick={() => handleStatusChange(student.hall_ticket_no, "absent")}
                              >Absent</Button>
                              <Button
                                size="sm"
                                variant={status === "late" ? "default" : "outline"}
                                className={cn("h-7 px-3 text-xs w-[80px]", status === "late" && "bg-warning/90 hover:bg-warning text-white border-transparent")}
                                onClick={() => handleStatusChange(student.hall_ticket_no, "late")}
                              >Late</Button>
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
                  <span className="text-6xl font-bold tracking-tighter text-primary drop-shadow-sm">{stats.percentage}<span className="text-3xl">%</span></span>
                  <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider mt-2">Class Attendance</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-success/5 transition-colors">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success"/> Present</span>
                    <span className="font-bold text-base">{stats.present}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-destructive/5 transition-colors">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground"><XCircle className="h-4 w-4 text-destructive"/> Absent</span>
                    <span className="font-bold text-base">{stats.absent}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-warning/5 transition-colors">
                    <span className="flex items-center gap-2 font-medium text-muted-foreground"><Clock className="h-4 w-4 text-warning"/> Late</span>
                    <span className="font-bold text-base">{stats.late}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button 
              className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              onClick={handleSubmit}
              disabled={isSubmitting || displayedStudents.length === 0}
            >
              {isSubmitting ? (
                 <><AlertCircle className="mr-2 h-5 w-5 animate-pulse" /> Pushing to DB...</>
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
                      <p className="font-medium capitalize">{request.request_type} • {request.subject || 'General'}</p>
                      <p className="text-sm text-muted-foreground">Student: {request.student_id} • Date: {request.request_date || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90 text-white"
                        onClick={() => handleRequestDecision(request.id, 'approved')}
                        disabled={processingRequestId === request.id}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRequestDecision(request.id, 'rejected')}
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
