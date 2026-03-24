const fs = require('fs');

const code = `import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock, Users, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'Computer Science',
    credits: 3,
    faculty_id: 'unassigned',
    semester: 'Fall 2026',
    max_capacity: 60,
    schedule: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [coursesRes, facultyRes] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('faculty').select('*')
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (facultyRes.error) throw facultyRes.error;

      setCourses(coursesRes.data || []);
      setFaculty(facultyRes.data || []);
    } catch (error: any) {
      if (error?.code !== 'PGRST205') {
        toast({ title: "Error loading data", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let faculty_name = 'Unassigned';
      let faculty_id: string | null = formData.faculty_id;

      if (faculty_id && faculty_id !== 'unassigned') {
        const assignedFac = faculty.find(f => f.staff_id === faculty_id);
        if (assignedFac) faculty_name = assignedFac.name;
      } else {
        faculty_id = null;
      }

      const newCourse = {
        ...formData,
        faculty_id,
        faculty_name
      };

      const { error } = await supabase.from('courses').insert([newCourse]);
      if (error) throw error;

      toast({ title: "Success", description: "Course added successfully" });
      setIsDialogOpen(false);
      setFormData({
        code: '',
        name: '',
        department: 'Computer Science',
        credits: 3,
        faculty_id: 'unassigned',
        semester: 'Fall 2026',
        max_capacity: 60,
        schedule: ''
      });
      await fetchData();
    } catch (error: any) {
      toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Course deleted successfully" });
      setCourses(courses.filter(c => c.id !== id));
    } catch (error: any) {
      toast({ title: "Deletion failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Course Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage all university courses and faculty assignments</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all">
              <Plus className="w-4 h-4 mr-2" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Add a new course and assign a faculty member.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input id="code" required placeholder="e.g. CS301" value={formData.code} onChange={(e) => handleInputChange('code', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits</Label>
                    <Input id="credits" type="number" required min="1" max="6" value={formData.credits} onChange={(e) => handleInputChange('credits', parseInt(e.target.value))} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input id="name" required placeholder="e.g. Data Structures" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(val) => handleInputChange('department', val)}>
                    <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faculty">Assign Faculty</Label>
                  <Select value={formData.faculty_id} onValueChange={(val) => handleInputChange('faculty_id', val)}>
                    <SelectTrigger><SelectValue placeholder="Select Faculty" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {faculty.map(f => (
                        <SelectItem key={f.staff_id} value={f.staff_id}>{f.name} ({f.department})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="schedule">Schedule</Label>
                     <Input id="schedule" placeholder="e.g. Mon/Wed 10 AM" value={formData.schedule} onChange={(e) => handleInputChange('schedule', e.target.value)} />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="max_capacity">Capacity</Label>
                     <Input id="max_capacity" type="number" value={formData.max_capacity} onChange={(e) => handleInputChange('max_capacity', parseInt(e.target.value))} />
                   </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Course"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={courses}
        searchKeys={["name", "code", "department", "faculty_name"]}
        searchPlaceholder="Search courses, faculty..."
        columns={[
          { key: "code", label: "Code", render: (item) => <span className="font-mono font-medium">{item.code}</span> },
          { key: "name", label: "Course Name", render: (item) => (
            <div>
               <div className="font-medium">{item.name}</div>
               <div className="text-xs text-muted-foreground flex items-center mt-1">
                 <Clock className="w-3 h-3 mr-1"/> {item.schedule || 'TBD'} • {item.semester}
               </div>
            </div>
          ) },
          { key: "department", label: "Department", render: (item) => <Badge variant="secondary">{item.department}</Badge> },
          { key: "credits", label: "Credits", render: (item) => <div className="text-center">{item.credits}</div> },
          { key: "faculty_name", label: "Lead Faculty", render: (item) => (
             <span className={!item.faculty_name || item.faculty_name === 'Unassigned' ? "text-muted-foreground italic" : "font-medium"}>
               {item.faculty_name || 'Unassigned'}
             </span>
          ) },
          { key: "enrolled_students", label: "Enrolled", render: (item) => (
            <div className="flex items-center gap-2">
               <Users className="w-4 h-4 text-muted-foreground" />
               <span>{item.enrolled_students} / {item.max_capacity}</span>
            </div>
          )},
          { 
             key: "actions", 
             label: "", 
             render: (item) => (
               <div className="flex justify-end">
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(item.id)}>
                    <X className="h-4 w-4" />
                 </Button>
               </div>
             )
          }
        ]}
      />
    </div>
  );
}`;

fs.writeFileSync('src/pages/admin/AdminCourses.tsx', code, 'utf8');
