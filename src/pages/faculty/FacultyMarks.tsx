import DataTable from "@/components/DataTable";
import { marksRecords } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function FacultyMarks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Manage Marks</h1>
        <p className="text-muted-foreground">Upload and manage student marks</p>
      </div>
      <DataTable
        data={marksRecords as unknown as Record<string, unknown>[]}
        searchKeys={["studentName", "courseName"]}
        searchPlaceholder="Search by student or course..."
        columns={[
          { key: "studentName", label: "Student" },
          { key: "courseName", label: "Course" },
          { key: "assignment1", label: "Asgn 1" },
          { key: "midterm", label: "Midterm" },
          { key: "assignment2", label: "Asgn 2" },
          { key: "final", label: "Final" },
          { key: "total", label: "Total" },
          { key: "grade", label: "Grade", render: (item) => <Badge variant="outline" className="font-bold">{String(item.grade)}</Badge> },
        ]}
      />
    </div>
  );
}
