import DataTable from "@/components/DataTable";
import { marksRecords } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const myMarks = marksRecords.filter(m => m.studentId === "S001");

export default function StudentMarks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Marks & Grades</h1>
        <p className="text-muted-foreground">View your academic performance</p>
      </div>
      <DataTable
        data={myMarks as unknown as Record<string, unknown>[]}
        searchKeys={["courseName"]}
        columns={[
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
