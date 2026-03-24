const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('iep_raw.json', 'utf8'));

const newStudents = rawData.map(parts => {
  return {
    id: parts[0],
    name: parts[1].trim(),
    email: parts[0].toLowerCase() + '@student.sreyas.ac.in',
    role: 'student',
    department: 'CSE',
    batch: '23CSBTB49'
  };
});

let existingData = [];
try {
    existingData = JSON.parse(fs.readFileSync('parsed_students_all.json', 'utf8'));
} catch(e) {}

const existingIds = new Set(existingData.map(s => s.id));
let added = 0;
for (const student of newStudents) {
    if (!existingIds.has(student.id)) {
        existingData.push(student);
        added++;
    }
}

fs.writeFileSync('parsed_students_all.json', JSON.stringify(existingData, null, 2));
console.log('Added ' + added + ' students.');

