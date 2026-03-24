import { useState, useMemo } from "react";
import DataTable from "@/components/DataTable";
import { allStudents } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users } from "lucide-react";

export default function FacultyStudents() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const batchStats = useMemo(() => {
    const stats: Record<string, { count: number; department: string }> = {};
    allStudents.forEach(student => {
      if (student.role === 'student' && student.batch) {
        if (!stats[student.batch]) {
          stats[student.batch] = { count: 0, department: student.department || 'N/A' };
        }
        stats[student.batch].count++;
      }
    });
    return Object.entries(stats).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const batchStudents = useMemo(() => {
    if (!selectedBatch) return [];
    return allStudents.filter(s => s.role === 'student' && s.batch === selectedBatch);
  }, [selectedBatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {selectedBatch ? `Batch: ${selectedBatch}` : 'Student List'}
          </h1>
          <p className="text-muted-foreground">
            {selectedBatch ? `${batchStudents.length} students enrolled in this batch` : 'Select a batch to view students'}
          </p>
        </div>
        {selectedBatch && (
          <Button variant="outline" onClick={() => setSelectedBatch(null)}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Batches
          </Button>
        )}
      </div>

      {!selectedBatch ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batchStats.map(([batch, stat]) => (
            <Card 
              key={batch} 
              className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
              onClick={() => setSelectedBatch(batch)}
            >
              <CardHeader className="pb-3 text-center">
                <CardTitle className="text-xl font-display text-primary">{batch}</CardTitle>
                <CardDescription>Department: {stat.department}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/30 py-3 rounded-lg">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold text-foreground text-lg">{stat.count}</span> Students
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable
          data={batchStudents as unknown as Record<string, unknown>[]}
          searchKeys={["name", "email", "id"]}
          searchPlaceholder={`Search within ${selectedBatch}...`}
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "department", label: "Department", render: (item) => <Badge variant="outline">{String(item.department)}</Badge> }
          ]}
        />
      )}
    </div>
  );
}
