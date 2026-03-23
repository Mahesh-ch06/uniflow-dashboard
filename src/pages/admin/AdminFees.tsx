import DataTable from "@/components/DataTable";
import { feeRecords } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const feeStatusStyles = {
  paid: "bg-success/10 text-success border-success/30",
  partial: "bg-warning/10 text-warning border-warning/30",
  unpaid: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function AdminFees() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Fee Management</h1>
        <p className="text-muted-foreground">Track and manage student fee records</p>
      </div>
      <DataTable
        data={feeRecords as unknown as Record<string, unknown>[]}
        searchKeys={["studentName"]}
        searchPlaceholder="Search by student name..."
        columns={[
          { key: "studentName", label: "Student" },
          { key: "semester", label: "Semester" },
          { key: "totalFee", label: "Total Fee", render: (item) => `$${Number(item.totalFee).toLocaleString()}` },
          { key: "paidAmount", label: "Paid", render: (item) => `$${Number(item.paidAmount).toLocaleString()}` },
          { key: "fine", label: "Fine", render: (item) => Number(item.fine) > 0 ? <span className="text-destructive font-medium">${Number(item.fine)}</span> : "—" },
          { key: "status", label: "Status", render: (item) => (
            <Badge variant="outline" className={cn("capitalize", feeStatusStyles[item.status as keyof typeof feeStatusStyles])}>
              {String(item.status)}
            </Badge>
          )},
        ]}
      />
    </div>
  );
}
