
const fs = require('fs');
let code = fs.readFileSync('src/pages/faculty/FacultyAttendanceEdit.tsx', 'utf8');
code = code.replace(/console\.warn\(Could not insert batch name placeholder:, err\);\s*\}\s*\n\s*\}\);/g, 'console.warn(Could not insert batch name placeholder:, err);\\n        }\\n\\n        const { error } = await supabase.from(ttendance).upsert(recordsToUpsert, {\\n          onConflict: student_id,date,course_name,\\n        });');
fs.writeFileSync('src/pages/faculty/FacultyAttendanceEdit.tsx', code);

