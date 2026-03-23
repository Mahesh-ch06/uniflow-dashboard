import DataTable from "@/components/DataTable";
import { allStudents } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function FacultyStudents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Student List</h1>
        <p className="text-muted-foreground">Students enrolled in your courses</p>
      </div>
      <DataTable
        data={allStudents as unknown as Record<string, unknown>[]}
        searchKeys={["name", "email", "department"]}
        searchPlaceholder="Search students..."
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "department", label: "Department", render: (item) => <Badge variant="outline">{String(item.department)}</Badge> },
        ]}
      />
    </div>
  );
}
