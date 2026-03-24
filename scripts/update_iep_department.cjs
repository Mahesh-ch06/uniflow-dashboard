const fs = require('fs');

let data = JSON.parse(fs.readFileSync('parsed_students_all.json', 'utf8'));
let updatedCount = 0;

data.forEach(s => {
  if (s.batch === '23CSBTB49') {
    s.branch = 'CSE - IEP';
    s.department = 'CSE - IEP';
    updatedCount++;
  }
});

fs.writeFileSync('parsed_students_all.json', JSON.stringify(data, null, 2));
console.log('Updated ' + updatedCount + ' students.');

