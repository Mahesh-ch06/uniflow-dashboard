import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const statusStyles = {
  present: "bg-success/10 text-success border-success/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
  late: "bg-warning/10 text-warning border-warning/30",
};

export default function StudentAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myAttendance, setMyAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('attendance')
          .select('*')
          .eq('student_id', user.id)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        const formatted = (data || []).map(record => ({
          courseName: record.course_name,
          date: new Date(record.date).toLocaleDateString(),
          status: record.status,
          markedBy: record.marked_by_faculty || 'System'
        }));
        
        setMyAttendance(formatted);
      } catch (err: any) {
        toast({
          title: "Error fetching attendance",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchAttendance();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Attendance</h1>
        <p className="text-muted-foreground">Live real-time view of your attendance records.</p>
      </div>
      
      {loading ? (
        <p className="text-muted-foreground">Loading attendance...</p>
      ) : (
        <DataTable
          data={myAttendance}
          searchKeys={["courseName"]}
          searchPlaceholder="Search by course..."
          columns={[
            { key: "courseName", label: "Course" },
            { key: "date", label: "Date" },
            { key: "markedBy", label: "Marked By" },
            { key: "status", label: "Status", render: (item) => (
              <Badge variant="outline" className={cn("capitalize", statusStyles[item.status as keyof typeof statusStyles])}>
                {String(item.status)}
              </Badge>
            )},
          ]}
        />
      )}
    </div>
  );
}
