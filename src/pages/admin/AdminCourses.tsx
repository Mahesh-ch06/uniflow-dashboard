import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Clock,
  Filter,
  GraduationCap,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Users,
  AlertTriangle,
} from "lucide-react";

type CourseType = "mandatory" | "elective";

interface Course {
  id: string;
  code: string;
  name: string;
  department: string | null;
  credits: number | null;
  faculty_id: string | null;
  faculty_name: string | null;
  semester: string | null;
  course_type: CourseType | null;
  enrolled_students: number | null;
  max_capacity: number | null;
  schedule: string | null;
  created_at?: string;
}

interface Faculty {
  staff_id: string;
  name: string;
  department: string | null;
}

interface StudentCourse {
  course_id: string;
  status: "enrolled" | "completed" | "dropped";
}

interface CourseFormData {
  code: string;
  name: string;
  department: string;
  credits: number;
  faculty_id: string;
  semester: string;
  course_type: CourseType;
  max_capacity: number;
  schedule: string;
}

const defaultForm: CourseFormData = {
  code: "",
  name: "",
  department: "Computer Science",
  credits: 3,
  faculty_id: "unassigned",
  semester: "Fall 2026",
  course_type: "mandatory",
  max_capacity: 60,
  schedule: "",
};

const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];

const semesterOptions = [
  "Spring 2026",
  "Fall 2026",
  "Spring 2027",
  "Fall 2027",
];

const toCode = (value: string) => value.trim().toUpperCase();

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterFaculty, setFilterFaculty] = useState("all");

  const [formData, setFormData] = useState<CourseFormData>(defaultForm);

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, facultyRes, registrationsRes] = await Promise.all([
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("faculty").select("staff_id, name, department").order("name", { ascending: true }),
        supabase.from("student_courses").select("course_id, status"),
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (facultyRes.error) throw facultyRes.error;

      const registrationCounts = new Map<string, number>();
      if (!registrationsRes.error && registrationsRes.data) {
        (registrationsRes.data as StudentCourse[]).forEach((record) => {
          if (record.status !== "dropped") {
            const existing = registrationCounts.get(record.course_id) ?? 0;
            registrationCounts.set(record.course_id, existing + 1);
          }
        });
      }

      const hydratedCourses = (coursesRes.data ?? []).map((course) => ({
        ...course,
        enrolled_students: registrationCounts.get(course.id) ?? course.enrolled_students ?? 0,
      })) as Course[];

      setCourses(hydratedCourses);
      setFaculty((facultyRes.data ?? []) as Faculty[]);
    } catch (error: any) {
      if (error?.code !== "PGRST205" && error?.code !== "42P01") {
        toast({
          title: "Failed to load course data",
          description: error?.message ?? "Unexpected error",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateForm = <K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateDialog = () => {
    setEditingCourseId(null);
    setFormData(defaultForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourseId(course.id);
    setFormData({
      code: course.code ?? "",
      name: course.name ?? "",
      department: course.department ?? "Computer Science",
      credits: Number(course.credits ?? 3),
      faculty_id: course.faculty_id ?? "unassigned",
      semester: course.semester ?? "Fall 2026",
      course_type: (course.course_type ?? "mandatory") as CourseType,
      max_capacity: Number(course.max_capacity ?? 60),
      schedule: course.schedule ?? "",
    });
    setIsDialogOpen(true);
  };

  const resetFilters = () => {
    setFilterDepartment("all");
    setFilterSemester("all");
    setFilterType("all");
    setFilterFaculty("all");
  };

  const validateForm = () => {
    if (!toCode(formData.code)) return "Course code is required.";
    if (!formData.name.trim()) return "Course name is required.";
    if (!formData.department.trim()) return "Department is required.";
    if (!formData.semester.trim()) return "Semester is required.";
    if (!Number.isFinite(formData.credits) || formData.credits < 1 || formData.credits > 6) {
      return "Credits must be between 1 and 6.";
    }
    if (!Number.isFinite(formData.max_capacity) || formData.max_capacity < 1) {
      return "Capacity must be at least 1.";
    }

    if (editingCourseId) {
      const editingCourse = courses.find((course) => course.id === editingCourseId);
      const enrolled = Number(editingCourse?.enrolled_students ?? 0);
      if (formData.max_capacity < enrolled) {
        return `Capacity cannot be lower than enrolled students (${enrolled}).`;
      }
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({ title: "Invalid form data", description: validationError, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const code = toCode(formData.code);
      const assignedFaculty = faculty.find((person) => person.staff_id === formData.faculty_id);
      const facultyId = formData.faculty_id === "unassigned" ? null : formData.faculty_id;
      const facultyName = facultyId && assignedFaculty ? assignedFaculty.name : "Unassigned";

      const duplicateQuery = supabase
        .from("courses")
        .select("id")
        .eq("code", code)
        .limit(1);

      const duplicateRes = editingCourseId
        ? await duplicateQuery.neq("id", editingCourseId)
        : await duplicateQuery;

      if (duplicateRes.error) throw duplicateRes.error;
      if ((duplicateRes.data ?? []).length > 0) {
        toast({
          title: "Duplicate course code",
          description: `${code} already exists. Use a unique code.`,
          variant: "destructive",
        });
        return;
      }

      const payload = {
        code,
        name: formData.name.trim(),
        department: formData.department,
        credits: Number(formData.credits),
        faculty_id: facultyId,
        faculty_name: facultyName,
        semester: formData.semester,
        course_type: formData.course_type,
        max_capacity: Number(formData.max_capacity),
        schedule: formData.schedule.trim(),
      };

      const result = editingCourseId
        ? await supabase.from("courses").update(payload).eq("id", editingCourseId)
        : await supabase.from("courses").insert([payload]);

      if (result.error) throw result.error;

      toast({
        title: editingCourseId ? "Course updated" : "Course created",
        description: editingCourseId
          ? "Course details have been updated."
          : "New course has been added successfully.",
      });

      setIsDialogOpen(false);
      setEditingCourseId(null);
      setFormData(defaultForm);
      await fetchData();
    } catch (error: any) {
      toast({
        title: editingCourseId ? "Update failed" : "Creation failed",
        description: error?.message ?? "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    if (Number(courseToDelete.enrolled_students ?? 0) > 0) {
      toast({
        title: "Cannot delete course",
        description: "Course has enrolled students. Unenroll students before deleting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseToDelete.id);
      if (error) throw error;

      toast({ title: "Course deleted", description: `${courseToDelete.code} was removed.` });
      setCourseToDelete(null);
      setCourses((prev) => prev.filter((course) => course.id !== courseToDelete.id));
    } catch (error: any) {
      toast({ title: "Deletion failed", description: error?.message ?? "Unexpected error", variant: "destructive" });
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesDepartment = filterDepartment === "all" || (course.department ?? "") === filterDepartment;
      const matchesSemester = filterSemester === "all" || (course.semester ?? "") === filterSemester;
      const matchesType = filterType === "all" || (course.course_type ?? "mandatory") === filterType;

      const assigned = Boolean(course.faculty_id);
      const matchesFaculty =
        filterFaculty === "all" ||
        (filterFaculty === "assigned" && assigned) ||
        (filterFaculty === "unassigned" && !assigned);

      return matchesDepartment && matchesSemester && matchesType && matchesFaculty;
    });
  }, [courses, filterDepartment, filterSemester, filterType, filterFaculty]);

  const stats = useMemo(() => {
    const total = courses.length;
    const assignedCount = courses.filter((course) => Boolean(course.faculty_id)).length;
    const unassignedCount = total - assignedCount;

    const fillRates = courses
      .map((course) => {
        const enrolled = Number(course.enrolled_students ?? 0);
        const capacity = Number(course.max_capacity ?? 0);
        if (capacity <= 0) return 0;
        return (enrolled / capacity) * 100;
      })
      .filter((value) => Number.isFinite(value));

    const averageFill = fillRates.length
      ? Math.round(fillRates.reduce((acc, curr) => acc + curr, 0) / fillRates.length)
      : 0;

    const highOccupancy = courses.filter((course) => {
      const enrolled = Number(course.enrolled_students ?? 0);
      const capacity = Number(course.max_capacity ?? 0);
      return capacity > 0 && enrolled / capacity >= 0.9;
    }).length;

    return { total, assignedCount, unassignedCount, averageFill, highOccupancy };
  }, [courses]);

  const tableColumns = useMemo(
    () => [
      {
        key: "code",
        label: "Code",
        render: (item: Course) => <span className="font-mono font-semibold">{item.code}</span>,
      },
      {
        key: "name",
        label: "Course",
        render: (item: Course) => (
          <div>
            <div className="font-medium text-foreground">{item.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {item.schedule?.trim() ? item.schedule : "Schedule TBD"}
              <span>•</span>
              {item.semester || "Semester TBD"}
            </div>
          </div>
        ),
      },
      {
        key: "department",
        label: "Department",
        render: (item: Course) => <Badge variant="secondary">{item.department ?? "N/A"}</Badge>,
      },
      {
        key: "course_type",
        label: "Type",
        render: (item: Course) => (
          <Badge variant={item.course_type === "elective" ? "outline" : "default"}>
            {item.course_type === "elective" ? "Elective" : "Mandatory"}
          </Badge>
        ),
      },
      {
        key: "credits",
        label: "Credits",
        render: (item: Course) => <span className="font-medium">{item.credits ?? 0}</span>,
      },
      {
        key: "faculty_name",
        label: "Faculty",
        render: (item: Course) => (
          <span className={item.faculty_id ? "font-medium" : "text-muted-foreground italic"}>
            {item.faculty_name && item.faculty_name !== "Unassigned" ? item.faculty_name : "Unassigned"}
          </span>
        ),
      },
      {
        key: "enrolled_students",
        label: "Enrollment",
        render: (item: Course) => {
          const enrolled = Number(item.enrolled_students ?? 0);
          const capacity = Number(item.max_capacity ?? 0);
          const isHigh = capacity > 0 && enrolled / capacity >= 0.9;

          return (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className={isHigh ? "text-warning font-medium" : ""}>
                {enrolled} / {capacity}
              </span>
              {isHigh && <AlertTriangle className="w-4 h-4 text-warning" />}
            </div>
          );
        },
      },
      {
        key: "actions",
        label: "",
        render: (item: Course) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEditDialog(item)}
              aria-label={`Edit ${item.code}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setCourseToDelete(item)}
              aria-label={`Delete ${item.code}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [faculty],
  );

  const uniqueDepartments = useMemo(() => {
    const values = Array.from(new Set(courses.map((course) => course.department).filter(Boolean)));
    return values as string[];
  }, [courses]);

  const uniqueSemesters = useMemo(() => {
    const values = Array.from(new Set(courses.map((course) => course.semester).filter(Boolean)));
    return values as string[];
  }, [courses]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Course Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage academic offerings, faculty assignments, and course capacity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RotateCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button className="gradient-primary text-primary-foreground" onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" /> Add Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Courses" value={stats.total} icon={BookOpen} variant="primary" trend="Active catalog" trendUp />
        <StatCard title="Faculty Assigned" value={stats.assignedCount} icon={GraduationCap} variant="secondary" trend={`${stats.unassignedCount} unassigned`} trendUp={stats.unassignedCount === 0} />
        <StatCard title="Avg Fill Rate" value={`${stats.averageFill}%`} icon={Users} variant="accent" trend="Across all courses" trendUp={stats.averageFill >= 70} />
        <StatCard title="High Occupancy" value={stats.highOccupancy} icon={AlertTriangle} variant="default" trend="90%+ capacity" trendUp={stats.highOccupancy === 0} />
      </div>

      <div className="border rounded-xl p-4 bg-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="w-4 h-4" /> Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger><SelectValue placeholder="All departments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {uniqueDepartments.map((department) => (
                  <SelectItem key={department} value={department}>{department}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Semester</Label>
            <Select value={filterSemester} onValueChange={setFilterSemester}>
              <SelectTrigger><SelectValue placeholder="All semesters" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All semesters</SelectItem>
                {uniqueSemesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="mandatory">Mandatory</SelectItem>
                <SelectItem value="elective">Elective</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Faculty</Label>
            <Select value={filterFaculty} onValueChange={setFilterFaculty}>
              <SelectTrigger><SelectValue placeholder="All assignments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignments</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="opacity-0">Reset</Label>
            <Button variant="outline" className="w-full" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="border rounded-xl p-8 bg-card text-center text-muted-foreground">Loading courses...</div>
      ) : (
        <DataTable
          data={filteredCourses}
          searchKeys={["name", "code", "department", "faculty_name", "semester"]}
          searchPlaceholder="Search by code, name, faculty, semester..."
          columns={tableColumns}
        />
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCourseId(null);
            setFormData(defaultForm);
          }
        }}
      >
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingCourseId ? "Edit Course" : "Create Course"}</DialogTitle>
              <DialogDescription>
                {editingCourseId
                  ? "Update academic, capacity, and faculty details."
                  : "Add a new course to the university catalog."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-code">Course Code</Label>
                <Input
                  id="course-code"
                  required
                  maxLength={20}
                  placeholder="e.g. CS301"
                  value={formData.code}
                  onChange={(event) => updateForm("code", toCode(event.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-credits">Credits</Label>
                <Input
                  id="course-credits"
                  type="number"
                  min={1}
                  max={6}
                  required
                  value={formData.credits}
                  onChange={(event) => updateForm("credits", Number(event.target.value || 0))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input
                id="course-name"
                required
                placeholder="e.g. Data Structures & Algorithms"
                value={formData.name}
                onChange={(event) => updateForm("name", event.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={formData.department} onValueChange={(value) => updateForm("department", value)}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>{department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={formData.semester} onValueChange={(value) => updateForm("semester", value)}>
                  <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                  <SelectContent>
                    {semesterOptions.map((semester) => (
                      <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Type</Label>
                <Select value={formData.course_type} onValueChange={(value) => updateForm("course_type", value as CourseType)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="elective">Elective</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assign Faculty</Label>
                <Select value={formData.faculty_id} onValueChange={(value) => updateForm("faculty_id", value)}>
                  <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {faculty.map((person) => (
                      <SelectItem key={person.staff_id} value={person.staff_id}>
                        {person.name} ({person.department || "N/A"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-schedule">Schedule</Label>
                <Input
                  id="course-schedule"
                  placeholder="e.g. Mon/Wed 10:00 AM"
                  value={formData.schedule}
                  onChange={(event) => updateForm("schedule", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-capacity">Max Capacity</Label>
                <Input
                  id="course-capacity"
                  type="number"
                  min={1}
                  required
                  value={formData.max_capacity}
                  onChange={(event) => updateForm("max_capacity", Number(event.target.value || 0))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingCourseId ? "Save Changes" : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(courseToDelete)} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              {courseToDelete
                ? `This action will permanently remove ${courseToDelete.code} (${courseToDelete.name}).`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
