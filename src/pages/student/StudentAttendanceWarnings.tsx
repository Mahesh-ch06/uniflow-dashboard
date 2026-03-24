import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { AlertCircle, History, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function StudentAttendanceWarnings() {
  const { user } = useAuth();
  const [consecutiveLates, setConsecutiveLates] = useState(0);
  const [lateHistory, setLateHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWarnings() {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from("attendance")
        .select("status, date, course_name, marked_by_faculty")
        .eq("student_id", user.id)
        .order("date", { ascending: false });
        
      if (data && data.length > 0) {
        let lates = 0;
        const currentLateStreak = [];
        
        for (const record of data) {
          if (record.status === "late") {
            lates++;
            currentLateStreak.push(record);
          } else {
            break;
          }
        }
        
        setConsecutiveLates(lates % 4);
        
        const allLates = data.filter(r => r.status === "late" || r.status === "absent");
        setLateHistory(allLates);
      }
      setIsLoading(false);
    }
    fetchWarnings();
  }, [user]);

  let warningBox = null;
  if (consecutiveLates === 0) {
    warningBox = (
      <div className="bg-emerald-500/10 border-emerald-500/30 border text-emerald-600 p-6 rounded-xl flex items-start gap-4">
        <Clock className="w-8 h-8 shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-bold mb-1">Excellent Punctuality</h3>
          <p>You have no consecutive late marks on your current record. Keep up the good work!</p>
        </div>
      </div>
    );
  } else if (consecutiveLates === 1) {
    warningBox = (
      <div className="bg-amber-500/10 border-amber-500/30 border text-amber-600 dark:text-amber-500 p-6 rounded-xl flex items-start gap-4">
        <AlertCircle className="w-8 h-8 shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-bold mb-1">Warning: 1/3 Lates</h3>
          <p>You were marked late for your last class. If you reach 3 consecutive lates, your 4th mark will automatically become an <strong>Absent</strong>.</p>
        </div>
      </div>
    );
  } else if (consecutiveLates === 2) {
    warningBox = (
      <div className="bg-amber-500/20 border-amber-500/50 border text-amber-600 px-6 py-6 rounded-xl flex items-start gap-4">
        <AlertCircle className="w-8 h-8 shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-bold mb-1">Warning: 2/3 Lates</h3>
          <p>You currently have 2 back-to-back late marks. Only 1 more late before your next late class is heavily penalized and marked as Absent! Please be on time.</p>
        </div>
      </div>
    );
  } else if (consecutiveLates === 3) {
    warningBox = (
      <div className="bg-destructive/15 border-destructive/50 border text-destructive p-6 rounded-xl flex items-start gap-4">
        <AlertCircle className="w-8 h-8 shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-bold mb-1">CRITICAL SYSTEM WARNING: 3/3 Lates</h3>
          <p className="font-medium">You have hit the maximum limit of 3 consecutive lates.</p>
          <p className="mt-2 text-sm opacity-90">If you are late to your <strong>very next class</strong>, the system will automatically convert it to an <strong>Absent</strong> mark. This will affect your overall attendance percentage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Attendance Warnings</h1>
        <p className="text-muted-foreground">Monitor your punctuality and late penalty status</p>
      </div>
      
      {isLoading ? (
        <p>Loading your warning status...</p>
      ) : (
        <>
          {warningBox}
          
          <Card className="mt-8">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Recent Penalty History</CardTitle>
              </div>
              <CardDescription>
                Your recent history of late and absent marks. Being present breaks your late streak.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {lateHistory.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No previous lates or absents found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Date</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Marked By</TableHead>
                      <TableHead className="text-right pr-6">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lateHistory.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="pl-6 font-medium">{record.date}</TableCell>
                        <TableCell>{record.course_name}</TableCell>
                        <TableCell>{record.marked_by_faculty || "System"}</TableCell>
                        <TableCell className="text-right pr-6">
                           <Badge variant="outline" className={
                             record.status === "absent" ? "bg-red-500/10 text-red-600 border-red-500/30" : 
                             record.status === "late" ? "bg-amber-500/10 text-amber-600 border-amber-500/30" : ""
                           }>
                             {record.status.toUpperCase()}
                           </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
