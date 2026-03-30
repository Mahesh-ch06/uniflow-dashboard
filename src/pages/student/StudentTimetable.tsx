import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Clock3 } from "lucide-react";

interface StudentProfile {
  hall_ticket_no: string;
  batch_name: string | null;
  section: string | null;
}

interface StudentTimetableRow {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  course_code: string;
  course_name: string;
  room: string | null;
  faculty_name: string | null;
  faculty_staff_id: string;
  batch_name: string;
  section: string | null;
}

interface FacultyLookup {
  staff_id: string;
  name: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isRelationMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

export default function StudentTimetable() {
  const { user } = useAuth();
  const [rows, setRows] = useState<StudentTimetableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);

  const grouped = useMemo(() => {
    const map = new Map<string, StudentTimetableRow[]>();
    days.forEach((day) => map.set(day, []));

    rows.forEach((row) => {
      const existing = map.get(row.day) || [];
      existing.push(row);
      map.set(row.day, existing);
    });

    days.forEach((day) => {
      const dayRows = map.get(day) || [];
      dayRows.sort((a, b) => a.start_time.localeCompare(b.start_time));
      map.set(day, dayRows);
    });

    return map;
  }, [rows]);

  const fetchTimetable = async () => {
    if (!user?.id) return;

    const { data: profileData, error: profileError } = await supabase
      .from("students")
      .select("hall_ticket_no, batch_name, section")
      .eq("hall_ticket_no", user.id)
      .single();

    if (profileError || !profileData) {
      setRows([]);
      setLoading(false);
      return;
    }

    const profile = profileData as StudentProfile;

    const { data: viewData, error: viewError } = await supabase
      .from("student_timetable_v")
      .select("id, day, start_time, end_time, course_code, course_name, room, faculty_name, faculty_staff_id, batch_name, section")
      .eq("hall_ticket_no", profile.hall_ticket_no)
      .order("day", { ascending: true })
      .order("start_time", { ascending: true });

    if (!viewError) {
      setTableReady(true);
      setRows((viewData || []) as StudentTimetableRow[]);
      setLoading(false);
      return;
    }

    if (!isRelationMissing(viewError.code)) {
      setRows([]);
      setLoading(false);
      return;
    }

    const [baseTimetableRes, facultyRes] = await Promise.all([
      supabase
        .from("timetable")
        .select("id, day, start_time, end_time, course_code, course_name, room, faculty_staff_id, batch_name, section")
        .eq("batch_name", profile.batch_name || "")
        .eq("is_active", true),
      supabase.from("faculty").select("staff_id, name"),
    ]);

    if (baseTimetableRes.error) {
      if (isRelationMissing(baseTimetableRes.error.code)) {
        setTableReady(false);
      }
      setRows([]);
      setLoading(false);
      return;
    }

    const facultyMap = new Map<string, string>();
    ((facultyRes.data || []) as FacultyLookup[]).forEach((faculty) => {
      facultyMap.set(faculty.staff_id, faculty.name);
    });

    const filtered = ((baseTimetableRes.data || []) as Array<Omit<StudentTimetableRow, "faculty_name">>).filter((item) => {
      if (!item.section || item.section.trim() === "") return true;
      return item.section === (profile.section || "");
    });

    const mapped = filtered.map((item) => ({
      ...item,
      faculty_name: facultyMap.get(item.faculty_staff_id) || item.faculty_staff_id,
    }));

    setTableReady(true);
    setRows(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchTimetable();

    const channel = supabase
      .channel(`student-timetable-live-${user?.id || "unknown"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "timetable" }, () => fetchTimetable())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Timetable</h1>
        <p className="text-muted-foreground">Your weekly class schedule mapped from batch/section in real time</p>
      </div>

      {!tableReady && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Timetable table/view is not configured yet.
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading timetable...</div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => {
            const dayEntries = grouped.get(day) || [];
            if (dayEntries.length === 0) return null;

            return (
              <div key={day}>
                <h3 className="font-display font-semibold text-foreground mb-2">{day}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dayEntries.map((entry) => (
                    <div key={entry.id} className="bg-card rounded-xl p-4 border shadow-card">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="text-xs font-mono font-bold text-primary">{entry.course_code}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                          <Clock3 className="h-3 w-3" />
                          {entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground text-sm">{entry.course_name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{entry.room || "Room TBD"} • {entry.faculty_name || entry.faculty_staff_id}</p>
                      <div className="mt-2">
                        <Badge variant="secondary">{entry.batch_name}{entry.section ? `-${entry.section}` : ""}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {rows.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No timetable entries mapped for your batch/section yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
