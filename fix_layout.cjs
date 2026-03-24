const fs = require('fs');

let layout = fs.readFileSync('src/components/DashboardLayout.tsx', 'utf8');
if (!layout.includes('/student/courses')) {
  layout = layout.replace(
    /\{ title: "Fees", path: "\/student\/fees" \},/g,
    '{ title: "Fees", path: "/student/fees" },\n        { title: "Course Registration", path: "/student/courses" },'
  );
  fs.writeFileSync('src/components/DashboardLayout.tsx', layout);
}

let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('StudentCourses')) {
  app = app.replace(
    /import StudentFees from ".\/pages\/student\/StudentFees";/g,
    'import StudentFees from "./pages/student/StudentFees";\nimport StudentCourses from "./pages/student/StudentCourses";'
  );
  app = app.replace(
    /<Route path="fees" element={<StudentFees \/>} \/>/g,
    '<Route path="fees" element={<StudentFees />} />\n          <Route path="courses" element={<StudentCourses />} />'
  );
  fs.writeFileSync('src/App.tsx', app);
}
