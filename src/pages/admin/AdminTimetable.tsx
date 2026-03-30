import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Clock3, Plus, Trash2, Users } from "lucide-react";

type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

interface TimetableRow {
  id: string;
  day: WeekDay;
  start_time: string;
  end_time: string;
  course_id: string | null;
  course_code: string;
  course_name: string;
  faculty_staff_id: string;
  batch_name: string;
  section: string | null;
  room: string | null;
  meeting_link: string | null;
  is_active: boolean;
}

interface FacultyRow {
  staff_id: string;
  name: string;
}

interface CourseRow {
  id: string;
  code: string;
  name: string;
  faculty_id: string | null;
  faculty_name: string | null;
}

interface StudentRow {
  hall_ticket_no: string;
  batch_name: string | null;
  section: string | null;
}

const days: WeekDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isTableMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

const emptyForm = {
  day: "Monday" as WeekDay,
  start_time: "09:00",
  end_time: "09:50",
  course_id: "",
  course_code: "",
  course_name: "",
  faculty_staff_id: "",
  batch_name: "",
  section: "",
  room: "",
  meeting_link: "",
};

export default function AdminTimetable() {
  const { toast } = useToast();

  const [rows, setRows] = useState<TimetableRow[]>([]);
  const [faculty, setFaculty] = useState<FacultyRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tableReady, setTableReady] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const facultyMap = useMemo(() => {
    const map = new Map<string, string>();
    faculty.forEach((item) => map.set(item.staff_id, item.name));
    return map;
  }, [faculty]);

  const batchOptions = useMemo(
    () => Array.from(new Set(students.map((item) => item.batch_name || "").filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [students],
  );

  const sectionOptions = useMemo(() => {
    if (!form.batch_name) return [] as string[];
    return Array.from(
      new Set(
        students
          .filter((item) => item.batch_name === form.batch_name)
          .map((item) => item.section || "")
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [students, form.batch_name]);

  const mappedStudentCountBySlot = useMemo(() => {
    const map = new Map<string, number>();

    rows.forEach((row) => {
      const count = students.filter((student) => {
        if (student.batch_name !== row.batch_name) return false;
        if (!row.section || row.section.trim() === "") return true;
        return (student.section || "") === row.section;
      }).length;

      map.set(row.id, count);
    });

    return map;
  }, [rows, students]);

  const groupedByDay = useMemo(() => {
    const map = new Map<WeekDay, TimetableRow[]>();
    days.forEach((day) => map.set(day, []));

    rows.forEach((row) => {
      const list = map.get(row.day) || [];
      list.push(row);
      map.set(row.day, list);
    });

    days.forEach((day) => {
      const list = map.get(day) || [];
      list.sort((a, b) => a.start_time.localeCompare(b.start_time));
      map.set(day, list);
    });

    return map;
  }, [rows]);

  const fetchData = async () => {
    const [timetableRes, facultyRes, coursesRes, studentsRes] = await Promise.all([
      supabase
        .from("timetable")
        .select("id, day, start_time, end_time, course_id, course_code, course_name, faculty_staff_id, batch_name, section, room, meeting_link, is_active")
        .eq("is_active", true)
        .order("day", { ascending: true })
        .order("start_time", { ascending: true }),
      supabase.from("faculty").select("staff_id, name").order("name", { ascending: true }),
      supabase.from("courses").select("id, code, name, faculty_id, faculty_name").order("name", { ascending: true }),
      supabase.from("students").select("hall_ticket_no, batch_name, section"),
    ]);

    if (timetableRes.error) {
      if (isTableMissing(timetableRes.error.code)) {
        setTableReady(false);
        setRows([]);
      }
      setLoading(false);
      return;
    }

    setTableReady(true);
    setRows((timetableRes.data || []) as TimetableRow[]);
    setFaculty((facultyRes.data || []) as FacultyRow[]);
    setCourses((coursesRes.data || []) as CourseRow[]);
    setStudents((studentsRes.data || []) as StudentRow[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("admin-timetable-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "timetable" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "students" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCourseChange = (courseId: string) => {
    const course = courses.find((item) => item.id === courseId);

    setForm((prev) => ({
      ...prev,
      course_id: courseId,
      course_code: course?.code || "",
      course_name: course?.name || "",
      faculty_staff_id: course?.faculty_id || prev.faculty_staff_id,
    }));
  };

  const handleCreateSlot = async () => {
    if (!form.course_code || !form.course_name || !form.faculty_staff_id || !form.batch_name) {
      toast({
        title: "Missing required fields",
        description: "Course, faculty, batch and slot timings are required.",
        variant: "destructive",
      });
      return;
    }

    if (form.end_time <= form.start_time) {
      toast({
        title: "Invalid time range",
        description: "End time must be later than start time.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("timetable").insert({
      day: form.day,
      start_time: form.start_time,
      end_time: form.end_time,
      course_id: form.course_id || null,
      course_code: form.course_code,
      course_name: form.course_name,
      faculty_staff_id: form.faculty_staff_id,
      batch_name: form.batch_name,
      section: form.section || null,
      room: form.room || null,
      meeting_link: form.meeting_link || null,
      is_active: true,
    });

    if (error) {
      toast({ title: "Create failed", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    toast({
      title: "Timetable slot created",
      description: `Mapped to ${form.batch_name}${form.section ? ` - ${form.section}` : " (all sections)"}.`,
    });

    setDialogOpen(false);
    setForm(emptyForm);
    setSaving(false);
    fetchData();
  };

  const handleDeactivateSlot = async (slotId: string) => {
    const { error } = await supabase.from("timetable").update({ is_active: false }).eq("id", slotId);
    if (error) {
      toast({ title: "Failed to remove slot", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Slot removed", description: "The timetable entry has been deactivated." });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Timetable Management</h1>
          <p className="text-muted-foreground">Create slots, allocate faculty, and map students by batch/section in real time</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} disabled={!tableReady}>
          <Plus className="h-4 w-4 mr-2" /> Add Slot
        </Button>
      </div>

      {!tableReady && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Timetable table is not configured yet. Run the timetable SQL setup first.
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading timetable...</div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => {
            const dayEntries = groupedByDay.get(day) || [];
            if (dayEntries.length === 0) return null;

            return (
              <div key={day}>
                <h3 className="font-display font-semibold text-foreground mb-2">{day}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dayEntries.map((entry) => (
                    <div key={entry.id} className="bg-card rounded-xl p-4 border shadow-card space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-primary">{entry.course_code}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock3 className="h-3 w-3" /> {entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}
                        </span>
                      </div>

                      <h4 className="font-medium text-foreground text-sm">{entry.course_name}</h4>
                      <p className="text-xs text-muted-foreground">{entry.room || "Room TBD"}</p>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{facultyMap.get(entry.faculty_staff_id) || entry.faculty_staff_id}</Badge>
                        <Badge variant="secondary">{entry.batch_name}{entry.section ? `-${entry.section}` : ""}</Badge>
                        <Badge variant="outline" className="gap-1">
                          <Users className="h-3 w-3" /> {mappedStudentCountBySlot.get(entry.id) || 0} mapped
                        </Badge>
                      </div>

                      <div className="pt-1">
                        <Button variant="ghost" size="sm" onClick={() => handleDeactivateSlot(entry.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {rows.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No timetable slots yet. Create the first slot to start mapping students and faculty.
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Timetable Slot</DialogTitle>
            <DialogDescription>
              Assign course, faculty, and batch/section. Students are auto-mapped by batch and section.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={form.day} onValueChange={(value) => setForm((prev) => ({ ...prev, day: value as WeekDay }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {days.map((day) => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" value={form.start_time} onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" value={form.end_time} onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={form.course_id || "manual"} onValueChange={(value) => {
                if (value === "manual") {
                  setForm((prev) => ({ ...prev, course_id: "" }));
                  return;
                }
                handleCourseChange(value);
              }}>
                <SelectTrigger><SelectValue placeholder="Choose a course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>{course.code} • {course.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Course Code</Label>
                <Input value={form.course_code} onChange={(e) => setForm((prev) => ({ ...prev, course_code: e.target.value.toUpperCase() }))} />
              </div>
              <div className="space-y-2">
                <Label>Course Name</Label>
                <Input value={form.course_name} onChange={(e) => setForm((prev) => ({ ...prev, course_name: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Faculty</Label>
                <Select value={form.faculty_staff_id} onValueChange={(value) => setForm((prev) => ({ ...prev, faculty_staff_id: value }))}>
                  <SelectTrigger><SelectValue placeholder="Allocate faculty" /></SelectTrigger>
                  <SelectContent>
                    {faculty.map((item) => (
                      <SelectItem key={item.staff_id} value={item.staff_id}>{item.name} ({item.staff_id})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Batch</Label>
                <Select value={form.batch_name} onValueChange={(value) => setForm((prev) => ({ ...prev, batch_name: value, section: "" }))}>
                  <SelectTrigger><SelectValue placeholder="Choose batch" /></SelectTrigger>
                  <SelectContent>
                    {batchOptions.map((batch) => <SelectItem key={batch} value={batch}>{batch}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Section (optional)</Label>
                <Select value={form.section || "all"} onValueChange={(value) => setForm((prev) => ({ ...prev, section: value === "all" ? "" : value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sectionOptions.map((section) => <SelectItem key={section} value={section}>{section}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Room</Label>
                <Input value={form.room} onChange={(e) => setForm((prev) => ({ ...prev, room: e.target.value }))} placeholder="e.g., Block A-204" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meeting Link (optional)</Label>
              <Input value={form.meeting_link} onChange={(e) => setForm((prev) => ({ ...prev, meeting_link: e.target.value }))} placeholder="https://..." />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Auto mapping by batch/section</p>
              <div className="flex items-center gap-2">
                <Switch checked={true} disabled />
                <span className="text-xs text-muted-foreground">Enabled</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="w-full sm:w-auto" onClick={handleCreateSlot} disabled={saving}>
              {saving ? "Creating..." : "Create Slot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
