const fs = require('fs');
let content = fs.readFileSync('src/pages/student/StudentDashboard.tsx', 'utf8');

// 1. Add state variables
if (!content.includes('const [enrolledCourses, setEnrolledCourses]')) {
  content = content.replace(
    'const [pendingFees, setPendingFees] = useState<string>("Pending...");',
    'const [pendingFees, setPendingFees] = useState<string>("Pending...");\n  const [enrolledCourses, setEnrolledCourses] = useState<string>("Pending...");\n  const [gpa, setGpa] = useState<string>("Pending...");'
  );
}

const replacement = `          setPendingFees("₹0");
        }

        // Fetch Enrolled Courses & GPA
        const { data: coursesData } = await supabase
          .from('student_courses')
          .select('id, grade, status')
          .eq('student_id', studentData.id);

        if (coursesData) {
          const enrolled = coursesData.filter(c => c.status === 'enrolled').length;
          setEnrolledCourses(enrolled.toString());

          // Calculate GPA (A=4, B=3, C=2, D=1, F=0)
          const gradedCourses = coursesData.filter(c => c.status === 'completed' && c.grade);
          if (gradedCourses.length > 0) {
            const gradePoints = {
              'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0
            };
            let totalPoints = 0;
            let validGrades = 0;
            
            for (const c of gradedCourses) {
              if (c.grade && gradePoints[c.grade] !== undefined) {
                totalPoints += gradePoints[c.grade];
                validGrades++;
              }
            }
            if (validGrades > 0) {
              setGpa((totalPoints / validGrades).toFixed(2));
            } else {
              setGpa("N/A");
            }
          } else {
            setGpa("N/A");
          }
        } else {
            setEnrolledCourses("0");
            setGpa("N/A");
        }
      } else {
        setPendingFees("₹0");
        setEnrolledCourses("0");
        setGpa("N/A");
      }`;

// Regex correctly matching what was in the file:
//         } else {
//           setPendingFees("â‚¹0");
//         }
//       } else {
//         setPendingFees("â‚¹0");
//       }

content = content.replace(/setPendingFees\([^;]+;\s*}\s*} else {\s*setPendingFees\([^;]+;\s*}/, replacement);


// Fix INR everywhere else it appeared
content = content.replace(/â‚¹/g, '₹');

// 3. UI logic
content = content.replace(/<StatCard title="Enrolled Courses" value="Pending..."/g, '<StatCard title="Enrolled Courses" value={enrolledCourses}');
content = content.replace(/<StatCard title="GPA" value="Pending..."/g, '<StatCard title="GPA" value={gpa}');


fs.writeFileSync('src/pages/student/StudentDashboard.tsx', content);
console.log('Modified Student Dashboard!');