import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FacultyCourses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchMyCourses();
    }
  }, [user]);

  async function fetchMyCourses() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('faculty_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      if (error?.code !== 'PGRST205') {
        toast({ title: "Error loading courses", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          My Assigned Courses
        </h1>
        <p className="text-muted-foreground mt-1">Courses assigned to you for the current academic session.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{courses.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {courses.reduce((sum, c) => sum + (c.enrolled_students || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600 truncate mt-1">
              Fall 2026
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={courses}
        searchKeys={["name", "code", "department"]}
        searchPlaceholder="Search your courses..."
        columns={[
          { key: "code", label: "Code", render: (item) => <span className="font-mono font-medium">{item.code}</span> },
          { key: "name", label: "Course Name", render: (item) => (
            <div>
               <div className="font-medium text-base">{item.name}</div>
               <div className="text-xs text-muted-foreground flex items-center mt-1 gap-3">
                 <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {item.schedule || 'TBD'}</span>
                 <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {item.semester}</span>
               </div>
            </div>
          ) },
          { key: "credits", label: "Credits", render: (item) => <Badge variant="outline">{item.credits} Credits</Badge> },
          { key: "enrolled_students", label: "Class Strength", render: (item) => (
            <div className="flex items-center gap-2">
               <Users className="w-4 h-4 text-muted-foreground" />
               <span className="font-medium">{item.enrolled_students}</span>
               <span className="text-muted-foreground text-xs">/ {item.max_capacity}</span>
            </div>
          )},
        ]}
      />
    </div>
  );
}