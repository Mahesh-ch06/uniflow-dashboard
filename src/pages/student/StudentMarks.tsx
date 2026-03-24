import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function StudentMarks() {
  const { user } = useAuth();
  
  // Later we can implement real Supabase fetch here.
  // We're leaving it fresh without mock data.
  const myMarks: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Marks & Grades</h1>
        <p className="text-muted-foreground">View your academic performance ({user?.name})</p>
      </div>
      <DataTable
        data={myMarks as unknown as Record<string, unknown>[]}
        searchKeys={["courseName"]}
        columns={[
          { key: "courseName", label: "Course" },
          { key: "classTest", label: "Class Test" },
          { key: "labTest", label: "Lab Test" },
          { key: "mids", label: "Mids" },
          { key: "sem", label: "Sem" },
          { key: "project", label: "Project" },
          { key: "total", label: "Total" },
          { key: "grade", label: "Grade", render: (item) => <Badge variant="outline" className="font-bold">{String(item.grade)}</Badge> },
        ]}
      />
    </div>
  );
}
