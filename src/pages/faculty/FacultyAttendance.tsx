import DataTable from "@/components/DataTable";
import { attendanceRecords } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles = {
  present: "bg-success/10 text-success border-success/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
  late: "bg-warning/10 text-warning border-warning/30",
};

export default function FacultyAttendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Mark Attendance</h1>
        <p className="text-muted-foreground">View and update student attendance</p>
      </div>
      <DataTable
        data={attendanceRecords as unknown as Record<string, unknown>[]}
        searchKeys={["studentName", "courseName"]}
        searchPlaceholder="Search by student or course..."
        columns={[
          { key: "studentName", label: "Student" },
          { key: "courseName", label: "Course" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status", render: (item) => (
            <Badge variant="outline" className={cn("capitalize", statusStyles[item.status as keyof typeof statusStyles])}>
              {String(item.status)}
            </Badge>
          )},
        ]}
      />
    </div>
  );
}
