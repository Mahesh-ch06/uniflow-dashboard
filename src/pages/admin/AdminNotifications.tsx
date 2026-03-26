import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NotificationRow,
  NotificationType,
  formatNotificationDateTime,
  isNotificationsTableMissing,
  notificationTargetLabel,
} from "@/lib/notifications";

type AudienceMode = "all-students" | "selected-students" | "all-faculty" | "selected-faculty";
type TemplateCategory = "student" | "faculty";

interface NotificationTemplate {
  id: string;
  label: string;
  description: string;
  audienceMode: AudienceMode;
  type: NotificationType;
  title: string;
  message: string;
}

interface StudentOption {
  hall_ticket_no: string;
  name: string;
  batch_name: string;
  email?: string;
}

interface FacultyOption {
  staff_id: string;
  name: string;
  department: string;
  email?: string;
}

type LooseStudentRow = {
  hall_ticket_no?: string;
  id?: string;
  name?: string;
  batch_name?: string;
  batch?: string;
  department?: string;
  email?: string;
};

type LooseFacultyRow = {
  staff_id?: string;
  id?: string;
  name?: string;
  department?: string;
  email?: string;
};

const typeConfig = {
  info: { icon: Info, color: "text-info", bg: "bg-info/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  urgent: { icon: Bell, color: "text-destructive", bg: "bg-destructive/10" },
};

const notificationTemplates: NotificationTemplate[] = [
  {
    id: "academic-calendar",
    label: "Academic Calendar Update",
    description: "Professional update for students about revised academic schedule.",
    audienceMode: "all-students",
    type: "info",
    title: "Academic Calendar Update",
    message:
      "The updated academic calendar for the current semester has been published. Please review important dates for internal exams, assignment submissions, and semester-end examinations in your student portal.",
  },
  {
    id: "fee-reminder",
    label: "Fee Payment Reminder",
    description: "Friendly payment reminder with clear action for students.",
    audienceMode: "all-students",
    type: "warning",
    title: "Fee Payment Reminder",
    message:
      "This is a reminder to complete your pending fee payment before the due date to avoid late charges. Please visit the Fees section in your portal for payment details and receipt status.",
  },
  {
    id: "attendance-advisory",
    label: "Attendance Advisory",
    description: "Attendance compliance advisory for students.",
    audienceMode: "all-students",
    type: "warning",
    title: "Attendance Advisory Notice",
    message:
      "Students are advised to maintain the minimum attendance requirement as per university regulations. Please review your current attendance in the portal and contact your class mentor for support if needed.",
  },
  {
    id: "placement-drive",
    label: "Placement Drive Announcement",
    description: "Success-style notification for upcoming placement opportunities.",
    audienceMode: "all-students",
    type: "success",
    title: "Upcoming Placement Drive",
    message:
      "A new placement drive has been scheduled for eligible students. Please check eligibility criteria, required documents, and registration timeline in the Placements section.",
  },
  {
    id: "selected-student-urgent",
    label: "Critical Action Required (Selected Students)",
    description: "Urgent and direct message for selected students needing immediate action.",
    audienceMode: "selected-students",
    type: "urgent",
    title: "Urgent: Immediate Academic Action Required",
    message:
      "You have been identified for immediate academic follow-up. Please report to your class mentor/department office at the earliest and complete the required formalities within the given deadline.",
  },
  {
    id: "faculty-meeting",
    label: "Faculty Meeting Notice",
    description: "Official meeting notice template for faculty communication.",
    audienceMode: "all-faculty",
    type: "info",
    title: "Faculty Meeting Notification",
    message:
      "A faculty meeting is scheduled to discuss academic planning and departmental updates. Kindly confirm your availability and be prepared with your course progress summary.",
  },
  {
    id: "selected-faculty-action",
    label: "Action Required (Selected Faculty)",
    description: "Focused communication template for selected faculty members.",
    audienceMode: "selected-faculty",
    type: "warning",
    title: "Action Required: Departmental Follow-up",
    message:
      "You are requested to complete the assigned departmental follow-up and update the administration within the specified timeline.",
  },
  {
    id: "exam-duty",
    label: "Exam Duty Assignment",
    description: "Urgent notice template for examination duty instructions.",
    audienceMode: "all-faculty",
    type: "urgent",
    title: "Examination Duty Assignment",
    message:
      "Examination duty assignments have been published. Please verify your allocated slots and reporting location in the faculty portal, and contact administration in case of conflicts.",
  },
];

export default function AdminNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [faculty, setFaculty] = useState<FacultyOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tableReady, setTableReady] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("custom");
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("all-students");
  const [type, setType] = useState<NotificationType>("info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedFacultyIds, setSelectedFacultyIds] = useState<string[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [facultySearchQuery, setFacultySearchQuery] = useState("");

  const isStudentAudience = audienceMode === "all-students" || audienceMode === "selected-students";
  const isSelectedAudience = audienceMode === "selected-students" || audienceMode === "selected-faculty";

  const filteredStudents = useMemo(() => {
    const q = studentSearchQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((item) =>
      item.hall_ticket_no.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q),
    );
  }, [students, studentSearchQuery]);

  const filteredFaculty = useMemo(() => {
    const q = facultySearchQuery.trim().toLowerCase();
    if (!q) return faculty;
    return faculty.filter((item) =>
      item.staff_id.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q),
    );
  }, [faculty, facultySearchQuery]);

  const targetStatsLabel = useMemo(() => {
    if (audienceMode === "all-students") return `All Students (${students.length})`;
    if (audienceMode === "all-faculty") return `All Faculty (${faculty.length})`;
    if (audienceMode === "selected-students") return `Selected Students (${selectedStudentIds.length})`;
    return `Selected Faculty (${selectedFacultyIds.length})`;
  }, [audienceMode, students.length, faculty.length, selectedStudentIds.length, selectedFacultyIds.length]);

  const audienceCategory: TemplateCategory = audienceMode.includes("students") ? "student" : "faculty";
  const audienceScope = audienceMode.startsWith("selected") ? "selected" : "all";

  const audienceTemplates = useMemo(
    () => notificationTemplates.filter((template) => template.audienceMode === audienceMode),
    [audienceMode],
  );

  const selectedTemplate = useMemo(
    () => audienceTemplates.find((template) => template.id === selectedTemplateId),
    [audienceTemplates, selectedTemplateId],
  );

  useEffect(() => {
    if (selectedTemplateId !== "custom" && !selectedTemplate) {
      setSelectedTemplateId("custom");
    }

    if (audienceMode === "selected-students" && selectedTemplateId === "custom" && type === "info") {
      setType("urgent");
    }
  }, [audienceMode, selectedTemplate, selectedTemplateId, type]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, message, type, target_role, target_scope, recipient_ids, created_by, created_by_name, created_by_role, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      if (isNotificationsTableMissing(error.code)) {
        setTableReady(false);
        setNotifications([]);
      }
      return;
    }

    setTableReady(true);
    setNotifications((data || []) as NotificationRow[]);
  };

  const fetchRecipients = async () => {
    const mapStudents = (rows: LooseStudentRow[]): StudentOption[] =>
      rows
        .map((row) => ({
          hall_ticket_no: String(row.hall_ticket_no || row.id || "").trim(),
          name: String(row.name || "Unknown Student").trim(),
          batch_name: String(row.batch_name || row.batch || row.department || "N/A").trim(),
          email: typeof row.email === "string" ? row.email : undefined,
        }))
        .filter((row) => row.hall_ticket_no.length > 0);

    const mapFaculty = (rows: LooseFacultyRow[]): FacultyOption[] =>
      rows
        .map((row) => ({
          staff_id: String(row.staff_id || row.id || "").trim(),
          name: String(row.name || "Unknown Faculty").trim(),
          department: String(row.department || "N/A").trim(),
          email: typeof row.email === "string" ? row.email : undefined,
        }))
        .filter((row) => row.staff_id.length > 0);

    let loadedStudents: StudentOption[] = [];
    const studentsWithEmail = await supabase
      .from("students")
      .select("hall_ticket_no, name, batch_name, email")
      .order("name", { ascending: true });

    if (!studentsWithEmail.error) {
      loadedStudents = mapStudents((studentsWithEmail.data || []) as LooseStudentRow[]);
    } else {
      const studentsWithoutEmail = await supabase
        .from("students")
        .select("hall_ticket_no, name, batch_name")
        .order("name", { ascending: true });

      if (!studentsWithoutEmail.error) {
        loadedStudents = mapStudents((studentsWithoutEmail.data || []) as LooseStudentRow[]);
      }
    }

    let loadedFaculty: FacultyOption[] = [];
    const facultyWithEmail = await supabase
      .from("faculty")
      .select("staff_id, name, department, email")
      .order("name", { ascending: true });

    if (!facultyWithEmail.error) {
      loadedFaculty = mapFaculty((facultyWithEmail.data || []) as LooseFacultyRow[]);
    } else {
      const facultyWithoutEmail = await supabase
        .from("faculty")
        .select("staff_id, name, department")
        .order("name", { ascending: true });

      if (!facultyWithoutEmail.error) {
        loadedFaculty = mapFaculty((facultyWithoutEmail.data || []) as LooseFacultyRow[]);
      }
    }

    setStudents(loadedStudents);
    setFaculty(loadedFaculty);

    if (loadedStudents.length === 0 && loadedFaculty.length === 0) {
      toast({
        title: "Recipients unavailable",
        description: "Could not load students/faculty recipients from database.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchNotifications(), fetchRecipients()]);
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`admin-notifications-${user?.id || "admin"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => fetchNotifications())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const toggleSelectedStudent = (id: string) => {
    setSelectedStudentIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectedFaculty = (id: string) => {
    setSelectedFacultyIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const resetForm = () => {
    setSelectedTemplateId("custom");
    setAudienceMode("all-students");
    setType("info");
    setTitle("");
    setMessage("");
    setSelectedStudentIds([]);
    setSelectedFacultyIds([]);
    setStudentSearchQuery("");
    setFacultySearchQuery("");
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);

    if (templateId === "custom") return;

    const template = audienceTemplates.find((item) => item.id === templateId);
    if (!template) return;

    setType(template.type);
    setTitle(template.title);
    setMessage(template.message);
    setSelectedStudentIds([]);
    setSelectedFacultyIds([]);
    setStudentSearchQuery("");
    setFacultySearchQuery("");
  };

  const handleTemplateCategoryChange = (category: string) => {
    const nextCategory = category as TemplateCategory;
    const nextAudience: AudienceMode = nextCategory === "student"
      ? (audienceScope === "selected" ? "selected-students" : "all-students")
      : (audienceScope === "selected" ? "selected-faculty" : "all-faculty");

    setAudienceMode(nextAudience);
  };

  const handleSelectAllFiltered = () => {
    if (isStudentAudience) {
      setSelectedStudentIds(Array.from(new Set(filteredStudents.map((item) => item.hall_ticket_no))));
      return;
    }
    setSelectedFacultyIds(Array.from(new Set(filteredFaculty.map((item) => item.staff_id))));
  };

  const handleClearAllFiltered = () => {
    if (isStudentAudience) {
      setSelectedStudentIds([]);
      return;
    }
    setSelectedFacultyIds([]);
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({ title: "Missing fields", description: "Title and message are required.", variant: "destructive" });
      return;
    }

    if (!tableReady) {
      toast({
        title: "Notifications table missing",
        description: "Run supabase-setup-notifications.sql in Supabase first.",
        variant: "destructive",
      });
      return;
    }

    const isTargetingStudents = audienceMode === "all-students" || audienceMode === "selected-students";
    const targetRole = isTargetingStudents ? "student" : "faculty";
    const targetScope = isSelectedAudience ? "selected" : "all";
    const recipientIds = isTargetingStudents ? selectedStudentIds : selectedFacultyIds;

    if (targetScope === "selected" && recipientIds.length === 0) {
      toast({
        title: "Select recipients",
        description: "Please select at least one recipient for selected notifications.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from("notifications").insert({
        title: title.trim(),
        message: message.trim(),
        type,
        target_role: targetRole,
        target_scope: targetScope,
        recipient_ids: targetScope === "selected" ? recipientIds : [],
        created_by: user?.id || null,
        created_by_name: user?.name || "Admin",
        created_by_role: "admin",
      });

      if (error) throw error;

      toast({
        title: "Notification sent",
        description: `${targetStatsLabel} received the notification in realtime.`,
      });

      setDialogOpen(false);
      resetForm();
      fetchNotifications();
    } catch (err: any) {
      toast({ title: "Send failed", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Send realtime notifications to students and faculty</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" onClick={() => setDialogOpen(true)} disabled={!tableReady}>
          <Plus className="w-4 h-4 mr-2" />New Notification
        </Button>
      </div>

      {!tableReady && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Notifications table is not configured yet. Run <span className="font-semibold">supabase-setup-notifications.sql</span> in Supabase to enable realtime notifications.
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading notifications...</div>
      ) : (
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No notifications sent yet.
          </div>
        ) : notifications.map((n) => {
          const config = typeConfig[n.type] || typeConfig.info;
          const Icon = config.icon;
          return (
            <div key={n.id} className={cn("bg-card rounded-xl p-4 border shadow-card flex items-start gap-4 border-l-4 border-l-primary")}>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                <Icon className={cn("w-5 h-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{n.title}</h3>
                  <Badge variant="outline" className="capitalize text-xs">{notificationTargetLabel(n.target_role, n.target_scope)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {formatNotificationDateTime(n.created_at)}
                  {n.created_by_name ? ` • By ${n.created_by_name}` : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Send to all students, selected students, all faculty, or selected faculty with realtime delivery.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Template Category</Label>
              <Tabs value={audienceCategory} onValueChange={handleTemplateCategoryChange}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Audience</Label>
                <Select value={audienceMode} onValueChange={(value) => setAudienceMode(value as AudienceMode)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-students">All Students</SelectItem>
                    <SelectItem value="selected-students">Selected Students</SelectItem>
                    <SelectItem value="all-faculty">All Faculty</SelectItem>
                    <SelectItem value="selected-faculty">Selected Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Template</Label>
                <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Notification</SelectItem>
                    {audienceTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>{template.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {selectedTemplate
                ? selectedTemplate.description
                : `Templates are filtered by selected audience (${audienceMode.replace("-", " ")}). Use Custom Notification to write your own message.`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Priority Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as NotificationType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter notification title" />
            </div>

            <div className="grid gap-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your notification message" rows={4} />
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Preview</p>
              <p className="text-sm font-semibold text-foreground">{title.trim() || "Notification title"}</p>
              <p className="text-sm text-muted-foreground mt-1">{message.trim() || "Notification message preview will appear here."}</p>
            </div>

            {isSelectedAudience && (
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label>Select Recipients</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={handleSelectAllFiltered}>Select All</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={handleClearAllFiltered}>Clear</Button>
                  </div>
                </div>

                {isStudentAudience ? (
                  <Input
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder="Search by Hall Ticket Number or Name"
                  />
                ) : (
                  <Input
                    value={facultySearchQuery}
                    onChange={(e) => setFacultySearchQuery(e.target.value)}
                    placeholder="Search by Faculty Name or Faculty ID"
                  />
                )}

                <ScrollArea className="h-52 rounded-md border p-3">
                  <div className="space-y-2">
                    {isStudentAudience
                      ? filteredStudents.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No students found for this search.</p>
                        ) : filteredStudents.map((student) => (
                          <label key={student.hall_ticket_no} className="flex items-start gap-3 rounded-md border p-2 cursor-pointer hover:bg-muted/50">
                            <Checkbox
                              checked={selectedStudentIds.includes(student.hall_ticket_no)}
                              onCheckedChange={() => toggleSelectedStudent(student.hall_ticket_no)}
                            />
                            <div className="text-sm">
                              <p className="font-medium text-foreground">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.hall_ticket_no} • {student.batch_name}</p>
                            </div>
                          </label>
                        ))
                      : filteredFaculty.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No faculty found for this search.</p>
                        ) : filteredFaculty.map((member) => (
                          <label key={member.staff_id} className="flex items-start gap-3 rounded-md border p-2 cursor-pointer hover:bg-muted/50">
                            <Checkbox
                              checked={selectedFacultyIds.includes(member.staff_id)}
                              onCheckedChange={() => toggleSelectedFaculty(member.staff_id)}
                            />
                            <div className="text-sm">
                              <p className="font-medium text-foreground">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.staff_id} • {member.department}</p>
                            </div>
                          </label>
                        ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="w-full sm:w-auto" onClick={handleSendNotification} disabled={sending || !tableReady}>
              {sending ? "Sending..." : `Send to ${targetStatsLabel}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
