import DataTable from "@/components/DataTable";
import { attendanceRecords } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const myAttendance = attendanceRecords.filter(a => a.studentId === "S001");
const statusStyles = {
  present: "bg-success/10 text-success border-success/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
  late: "bg-warning/10 text-warning border-warning/30",
};

export default function StudentAttendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Attendance</h1>
        <p className="text-muted-foreground">View your attendance records</p>
      </div>
      <DataTable
        data={myAttendance as unknown as Record<string, unknown>[]}
        searchKeys={["courseName"]}
        searchPlaceholder="Search by course..."
        columns={[
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
