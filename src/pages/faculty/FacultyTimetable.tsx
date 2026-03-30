import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock3, ExternalLink, Layers3, MapPin, Users } from "lucide-react";

interface FacultyTimetableRow {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  course_code: string;
  course_name: string;
  batch_name: string;
  section: string | null;
  room: string | null;
  meeting_link: string | null;
  faculty_staff_id: string;
  is_active?: boolean;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isRelationMissing = (errorCode?: string) => {
  return errorCode === "PGRST205" || errorCode === "42P01";
};

const dayOrder = (day: string) => {
  const idx = days.indexOf(day);
  return idx === -1 ? 99 : idx;
};

const toMinutes = (timeValue: string) => {
  const [hour, minute] = String(timeValue || "00:00").split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
};

export default function FacultyTimetable() {
  const { user } = useAuth();

  const [rows, setRows] = useState<FacultyTimetableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);
  const [selectedDay, setSelectedDay] = useState("all");
  const [todayOnly, setTodayOnly] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const todayName = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long" }),
    [],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (todayOnly && row.day !== todayName) return false;
      if (selectedDay !== "all" && row.day !== selectedDay) return false;
      return true;
    });
  }, [rows, selectedDay, todayOnly, todayName]);

  const groupedByDay = useMemo(() => {
    const map = new Map<string, FacultyTimetableRow[]>();
    days.forEach((day) => map.set(day, []));

    filteredRows.forEach((row) => {
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
  }, [filteredRows]);

  const stats = useMemo(() => {
    const totalClasses = filteredRows.length;
    const uniqueBatches = new Set(filteredRows.map((row) => `${row.batch_name}${row.section ? `-${row.section}` : ""}`)).size;
    const totalCourses = new Set(filteredRows.map((row) => row.course_code)).size;
    const todayClasses = rows.filter((row) => row.day === todayName).length;

    const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const nextClassToday = rows
      .filter((row) => row.day === todayName)
      .sort((a, b) => toMinutes(a.start_time) - toMinutes(b.start_time))
      .find((row) => toMinutes(row.start_time) > currentMinutes) || null;

    return {
      totalClasses,
      uniqueBatches,
      totalCourses,
      todayClasses,
      nextClassToday,
    };
  }, [filteredRows, rows, todayName]);

  const fetchTimetable = async () => {
    if (!user?.id) return;

    const { data: fromView, error: viewError } = await supabase
      .from("faculty_timetable_v")
      .select("id, day, start_time, end_time, course_code, course_name, batch_name, section, room, meeting_link, faculty_staff_id")
      .eq("faculty_staff_id", user.id)
      .order("day", { ascending: true })
      .order("start_time", { ascending: true });

    if (!viewError) {
      setTableReady(true);
      setRows((fromView || []) as FacultyTimetableRow[]);
      setLoading(false);
      setLastUpdated(new Date());
      return;
    }

    if (!isRelationMissing(viewError.code)) {
      setRows([]);
      setLoading(false);
      return;
    }

    const { data: fromTable, error: tableError } = await supabase
      .from("timetable")
      .select("id, day, start_time, end_time, course_code, course_name, batch_name, section, room, meeting_link, faculty_staff_id, is_active")
      .eq("faculty_staff_id", user.id)
      .eq("is_active", true)
      .order("day", { ascending: true })
      .order("start_time", { ascending: true });

    if (tableError) {
      if (isRelationMissing(tableError.code)) {
        setTableReady(false);
      }
      setRows([]);
      setLoading(false);
      return;
    }

    setTableReady(true);
    setRows((fromTable || []) as FacultyTimetableRow[]);
    setLoading(false);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchTimetable();

    const channel = supabase
      .channel(`faculty-timetable-live-${user?.id || "unknown"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "timetable" }, () => fetchTimetable())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Faculty Timetable</h1>
          <p className="text-muted-foreground">Live class slots mapped to your faculty allocation</p>
        </div>
        <Badge variant="secondary" className="w-fit gap-1">
          <Clock3 className="h-3.5 w-3.5" /> Real-time
        </Badge>
      </div>

      {!tableReady && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Timetable table/view is not configured yet.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Visible Classes</p>
          <p className="text-lg font-display font-semibold text-foreground">{stats.totalClasses}</p>
        </div>
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Today's Classes</p>
          <p className="text-lg font-display font-semibold text-foreground">{stats.todayClasses}</p>
        </div>
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Active Courses</p>
          <p className="text-lg font-display font-semibold text-foreground">{stats.totalCourses}</p>
        </div>
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Batches Covered</p>
          <p className="text-lg font-display font-semibold text-foreground">{stats.uniqueBatches}</p>
        </div>
      </div>

      {stats.nextClassToday && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs text-primary font-medium">Next Class Today</p>
          <p className="text-sm font-semibold text-foreground mt-1">{stats.nextClassToday.course_name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.nextClassToday.start_time.slice(0, 5)} - {stats.nextClassToday.end_time.slice(0, 5)} • {stats.nextClassToday.batch_name}{stats.nextClassToday.section ? `-${stats.nextClassToday.section}` : ""}
          </p>
        </div>
      )}

      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-foreground">Filters</h2>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Day</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {days.map((day) => <SelectItem key={day} value={day}>{day}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label>Quick Mode</Label>
            <div className="h-10 px-3 border rounded-md flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Show only today's schedule</span>
              <Switch checked={todayOnly} onCheckedChange={setTodayOnly} />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading timetable...</div>
      ) : (
        <div className="space-y-4">
          {days
            .slice()
            .sort((a, b) => dayOrder(a) - dayOrder(b))
            .map((day) => {
              const entries = groupedByDay.get(day) || [];
              if (entries.length === 0) return null;

              return (
                <div key={day}>
                  <h3 className="font-display font-semibold text-foreground mb-2">{day}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {entries.map((entry) => (
                      <div key={entry.id} className="bg-card rounded-xl p-4 border shadow-card">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge variant="outline" className="font-mono">{entry.course_code}</Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}
                          </span>
                        </div>

                        <h4 className="font-medium text-foreground text-sm">{entry.course_name}</h4>

                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {entry.batch_name}{entry.section ? `-${entry.section}` : ""}</p>
                          <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {entry.room || "Room TBD"}</p>
                        </div>

                        {entry.meeting_link && (
                          <Button size="sm" variant="outline" className="mt-3" asChild>
                            <a href={entry.meeting_link} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3.5 w-3.5 mr-1" /> Join Link
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          {filteredRows.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No timetable entries available for your selected filters.
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border p-4 bg-muted/10">
        <p className="text-sm font-medium text-foreground flex items-center gap-2">
          <Layers3 className="h-4 w-4 text-primary" /> Missing something?
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Ask admin to create slots in Timetable Management and allocate your staff ID to each relevant class.
        </p>
      </div>
    </div>
  );
}
