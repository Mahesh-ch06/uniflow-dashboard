const fs = require('fs');
let content = fs.readFileSync('src/pages/faculty/FacultyDashboard.tsx', 'utf8');

// 1. Add state for myCoursesList
content = content.replace(
  '  const [stats, setStats] = useState({',
  '  const [myCourses, setMyCourses] = useState<any[]>([]);\n  const [stats, setStats] = useState({'
);

// 2. Populate myCoursesList
const target =       // 2. My Courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id')
        .eq('faculty_id', facultyId);
        
      const courseIds = (coursesData || []).map(c => c.id);;

const replacement =       // 2. My Courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('faculty_id', facultyId);
        
      setMyCourses(coursesData || []);
      const courseIds = (coursesData || []).map(c => c.id);;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/faculty/FacultyDashboard.tsx', content);
console.log('Fixed FacultyDashboard myCourses error!');
