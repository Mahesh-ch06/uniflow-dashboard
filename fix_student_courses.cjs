const fs = require('fs');

const code = `import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StudentCourses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
  }, [user]);

  async function fetchCourses() {
    setIsLoading(true);
    try {
      // Fetch all courses
      const { data: allCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch student's enrolled courses
      const { data: enrolledData, error: enrolledError } = await supabase
        .from('student_courses')
        .select('course_id, status')
        .eq('student_id', user?.id)
        .eq('status', 'enrolled');

      if (enrolledError && enrolledError.code !== 'PGRST116') {
        throw enrolledError;
      }

      const enrolledIds = new Set(enrolledData?.map((e: any) => e.course_id) || []);
      
      const available = allCourses?.map(course => ({
        ...course,
        isEnrolled: enrolledIds.has(course.id)
      })) || [];

      setCourses(available);
      setMyCourses(available.filter(c => c.isEnrolled));
      
    } catch (error: any) {
      if (error?.code !== 'PGRST205') {
        toast({ title: "Error loading courses", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleRegister = async (courseId: string) => {
    setIsRegistering(courseId);
    try {
      // Register in student_courses
      const { error: insertError } = await supabase
        .from('student_courses')
        .insert({
          student_id: user?.id,
          course_id: courseId,
          status: 'enrolled'
        });

      if (insertError) throw insertError;

      // Increment enrolled count
      await supabase.rpc('increment_course_enrollment', { c_id: courseId });

      toast({ title: "Success", description: "Successfully registered for course!" });
      await fetchCourses();
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setIsRegistering(null);
    }
  };

  const handleDrop = async (courseId: string, courseType: string) => {
    if (courseType === 'mandatory') {
      toast({ title: "Action not allowed", description: "Mandatory courses cannot be dropped.", variant: "destructive" });
      return;
    }
    
    if (!confirm('Are you sure you want to drop this elective?')) return;
    
    setIsRegistering(courseId);
    try {
      // Remove from student_courses
      const { error: deleteError } = await supabase
        .from('student_courses')
        .delete()
        .eq('student_id', user?.id)
        .eq('course_id', courseId);

      if (deleteError) throw deleteError;

      toast({ title: "Success", description: "Successfully dropped course." });
      await fetchCourses();
    } catch (error: any) {
      toast({ title: "Drop failed", description: error.message, variant: "destructive" });
    } finally {
      setIsRegistering(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Course Registration
        </h1>
        <p className="text-muted-foreground mt-1">Register for electives and view your mandatory course assignments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{myCourses.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {myCourses.reduce((sum, c) => sum + (c.credits || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-lg">Available Courses - Fall 2026</CardTitle>
          <CardDescription>Mandatory courses are auto-enrolled. Electives must be chosen.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={courses}
            searchKeys={["name", "code", "department"]}
            searchPlaceholder="Search courses by name or code..."
            columns={[
              { key: "code", label: "Code", render: (item) => <span className="font-mono font-medium">{item.code}</span> },
              { key: "name", label: "Course Name", render: (item) => (
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {item.name}
                    <Badge variant={item.course_type === 'elective' ? 'secondary' : 'default'} className="text-[10px] h-5 px-1.5">
                      {item.course_type === 'elective' ? 'Elective' : 'Mandatory'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1"/> {item.schedule || 'TBD'} • Prof. {item.faculty_name?.split(' ')[1] || 'Unassigned'}
                  </div>
                </div>
              ) },
              { key: "credits", label: "Credits", render: (item) => <div className="text-center font-medium">{item.credits}</div> },
              { key: "actions", label: "Status", render: (item) => (
                <div className="flex justify-end">
                  {item.isEnrolled ? (
                     <div className="flex items-center gap-2">
                       <span className="flex items-center text-success text-sm font-medium">
                         <CheckCircle className="w-4 h-4 mr-1" /> Enrolled
                       </span>
                       {item.course_type === 'elective' && (
                          <Button variant="outline" size="sm" className="h-7 text-xs text-destructive hover:bg-destructive/10" onClick={() => handleDrop(item.id, item.course_type)} disabled={isRegistering === item.id}>
                            Drop
                          </Button>
                       )}
                     </div>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleRegister(item.id)}
                      disabled={isRegistering === item.id || (item.enrolled_students >= item.max_capacity) || item.course_type === 'mandatory'}
                      className="h-8"
                    >
                      {item.enrolled_students >= item.max_capacity ? 'Full' : (item.course_type === 'mandatory' ? 'Contact Admin' : 'Register')}
                    </Button>
                  )}
                </div>
              )}
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}`;

fs.writeFileSync('src/pages/student/StudentCourses.tsx', code, 'utf8');
