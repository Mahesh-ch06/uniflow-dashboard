const fs = require('fs');
let code = fs.readFileSync('src/pages/faculty/FacultyAttendance.tsx', 'utf8');

const regex1 = /const existingStatusByStudent = useMemo\(\(\) => \{[\s\S]*?\}, \[\]\);/;
code = code.replace(regex1, `const [existingStatusByStudent, setExistingStatusByStudent] = useState<Record<string, AttendanceStatus>>({});`);

const regex2 = /const handleSubmitAttendance = \(\) => \{[\s\S]*?\};/;
const newSubmit = `const handleSubmitAttendance = async () => {
    if (!selectedContextKey || batchStudents.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const attendanceData = selectedAttendance;
      const dateStr = new Date().toISOString().split('T')[0];
      
      const recordsToUpsert = batchStudents.map(student => ({
        student_id: student.id,
        course_name: selectedBatch, 
        batch_name: selectedBatch,
        date: dateStr,
        status: attendanceData[student.id] || 'present',
        marked_by_faculty: user?.name || 'Faculty',
        faculty_id: user?.id || ''
      }));

      const { error } = await supabase.from('attendance').upsert(recordsToUpsert, {
        onConflict: 'student_id,date,course_name'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance marked successfully for " + selectedBatch,
      });

      setSubmittedByContext((prev) => ({ ...prev, [selectedContextKey]: true }));
      setEditingByContext((prev) => ({ ...prev, [selectedContextKey]: false }));
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };`;
code = code.replace(regex2, newSubmit);

fs.writeFileSync('src/pages/faculty/FacultyAttendance.tsx', code);
console.log('Done');