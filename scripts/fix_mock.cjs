const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-data.ts', 'utf8');
const replacementData = JSON.parse(fs.readFileSync('parsed_students_all.json', 'utf8')).map(s => ({
  id: s.id,
  name: s.name,
  email: s.email,
  role: 'student',
  department: s.branch,
  batch: s.batch
}));
const stringified = 'export const allStudents: User[] = ' + JSON.stringify(replacementData, null, 2) + ';';
data = data.replace('export const allStudents: User[];', stringified);
fs.writeFileSync('src/lib/mock-data.ts', data);
