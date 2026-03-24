const fs = require('fs');

const data = JSON.parse(fs.readFileSync('parsed_students_all.json', 'utf8'));

// Format to match the User interface
const newStudentsArray = data.map(s => ({
  id: s.id,
  name: s.name,
  email: s.email,
  role: 'student',
  department: s.branch,
  batch: s.batch
}));

const mockDataPath = 'src/lib/mock-data.ts';
let mockData = fs.readFileSync(mockDataPath, 'utf8');

// Find the allStudents array and replace it
const startIndex = mockData.indexOf('export const allStudents: User[] = [');

if (startIndex !== -1) {
  let endIndex = -1;
  let bracketCount = 0;
  let started = false;
  
  for (let i = startIndex; i < mockData.length; i++) {
    if (mockData[i] === '[') {
      bracketCount++;
      started = true;
    } else if (mockData[i] === ']') {
      bracketCount--;
    }
    
    if (started && bracketCount === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex !== -1) {
    const replacement = `export const allStudents: User[] = ${JSON.stringify(newStudentsArray, null, 2).replace(/"([^"]+)":/g, '$1:')}`;
    mockData = mockData.slice(0, startIndex) + replacement + mockData.slice(endIndex + 1);
    fs.writeFileSync(mockDataPath, mockData);
    console.log("Successfully updated allStudents in mock-data.ts with all 1500+ records!");
  } else {
    console.error("Could not find the end of the allStudents array.");
  }
} else {
  console.error("Could not find allStudents array in mock-data.ts");
}
