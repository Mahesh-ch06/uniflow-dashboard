import DataTable from "@/components/DataTable";
import { courses } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminCourses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Course Management</h1>
          <p className="text-muted-foreground">Manage all university courses</p>
        </div>
        <Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add Course</Button>
      </div>
      <DataTable
        data={courses as unknown as Record<string, unknown>[]}
        searchKeys={["name", "code", "department"]}
        searchPlaceholder="Search courses..."
        columns={[
          { key: "code", label: "Code" },
          { key: "name", label: "Course Name" },
          { key: "department", label: "Department", render: (item) => <Badge variant="outline">{String(item.department)}</Badge> },
          { key: "credits", label: "Credits" },
          { key: "facultyName", label: "Faculty" },
          { key: "enrolledStudents", label: "Enrolled", render: (item) => <span>{String(item.enrolledStudents)}/{String(item.maxCapacity)}</span> },
          { key: "semester", label: "Semester" },
        ]}
      />
    </div>
  );
}
