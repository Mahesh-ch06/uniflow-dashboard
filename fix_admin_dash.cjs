const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

// Update courses calculation
const oldCode = `      // Count unique departments
      const { data: deptData } = await supabase
        .from('students')
        .select('department');
      const uniqueDepartments = new Set(deptData?.map(d => d.department).filter(Boolean));

      setLiveStats({
        totalStudents: studentCount || 0,
        totalFaculty: facultyCount || 0,
        totalCourses: 0, // Not mapped in DB yet
        totalDepartments: uniqueDepartments.size
      });`;

const newCode = `      // Count unique departments
      const { data: deptData } = await supabase
        .from('students')
        .select('department');
      const uniqueDepartments = new Set(deptData?.map(d => d.department).filter(Boolean));

      // Count courses
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      setLiveStats({
        totalStudents: studentCount || 0,
        totalFaculty: facultyCount || 0,
        totalCourses: courseCount || 0,
        totalDepartments: uniqueDepartments.size
      });`;

content = content.replace(oldCode, newCode);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
console.log('Modified Admin Dashboard!');