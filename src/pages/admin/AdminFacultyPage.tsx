import DataTable from "@/components/DataTable";
import { allFaculty } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminFaculty() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Faculty Management</h1>
          <p className="text-muted-foreground">Manage faculty accounts</p>
        </div>
        <Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add Faculty</Button>
      </div>
      <DataTable
        data={allFaculty as unknown as Record<string, unknown>[]}
        searchKeys={["name", "email", "department"]}
        searchPlaceholder="Search faculty..."
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
