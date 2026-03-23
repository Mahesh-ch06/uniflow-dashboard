import { feeRecords } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const myFees = feeRecords.filter(f => f.studentId === "S001");

const feeStatusStyles = {
  paid: "bg-success/10 text-success border-success/30",
  partial: "bg-warning/10 text-warning border-warning/30",
  unpaid: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function StudentFees() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Fee Status</h1>
        <p className="text-muted-foreground">View your fee payment details</p>
      </div>
      {myFees.map(fee => (
        <div key={fee.id} className="bg-card rounded-xl p-6 border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">{fee.semester}</h3>
            <Badge variant="outline" className={cn("capitalize", feeStatusStyles[fee.status])}>{fee.status}</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tuition</p>
              <p className="text-lg font-bold text-foreground">${fee.tuitionFee.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lab Fee</p>
              <p className="text-lg font-bold text-foreground">${fee.labFee.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Library Fee</p>
              <p className="text-lg font-bold text-foreground">${fee.libraryFee.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">${fee.totalFee.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Paid: </span>
              <span className="font-bold text-success">${fee.paidAmount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Due: </span>
              <span className="font-bold text-foreground">{fee.dueDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
