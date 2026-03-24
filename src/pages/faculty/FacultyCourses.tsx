import DataTable from "@/components/DataTable";
import { courses } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function FacultyCourses() {
  const { user } = useAuth();
  const myCourses = courses.filter(c => c.facultyId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground">Courses assigned to you</p>
      </div>
      <DataTable
        data={myCourses as unknown as Record<string, unknown>[]}
        searchKeys={["name", "code"]}
        columns={[
          { key: "code", label: "Code" },
          { key: "name", label: "Course Name" },
          { key: "credits", label: "Credits" },
          { key: "enrolledStudents", label: "Students", render: (item) => `${item.enrolledStudents}/${item.maxCapacity}` },
          { key: "schedule", label: "Schedule" },
          { key: "semester", label: "Semester", render: (item) => <Badge variant="outline">{String(item.semester)}</Badge> },
        ]}
      />
    </div>
  );
}
