const xlsx = require('xlsx');
const fs = require('fs');

const filePath = 'c:\\Users\\mahes\\Downloads\\Updated II year I sem Student Nominal Rolls with branch change list and Batchwise List @ 06-08-2024, 01.00PM.xlsx';

try {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // Convert using header: 1 to get array of arrays, easier to process manually
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  const parsedStudents = [];
  let currentBatch = 'Default Batch';
  
  // Find column indices
  let idIdx = -1;
  let nameIdx = -1;
  let branchIdx = -1;
  let yearIdx = -1;
  let semIdx = -1;
  let sectionIdx = -1;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    // Check if this row is a header row
    if (row.includes('New HTNo') || row.includes('HTNo') || row.includes('Student Name')) {
      idIdx = Math.max(row.indexOf('New HTNo'), row.indexOf('HTNo'));
      nameIdx = row.indexOf('Student Name');
      branchIdx = row.indexOf('Branch');
      yearIdx = row.indexOf('Year');
      semIdx = row.indexOf('Sem');
      // maybe section name is somehow given? sometimes it's the title above, but let's just stick to batch.
      continue;
    }

    // Check if this is a batch row (usually just one item in the row and it's a string, e.g. "23CSBTB01")
    // or if the first cell (which might be section "CSE - A") contains the batch
    if (row.length > 0 && String(row[0]).match(/^[A-Z0-9]+$/) && row[1] === undefined && idIdx !== -1) {
       currentBatch = String(row[0]);
       continue;
    }
    // Also sometimes it's under index 0 when headers are mapped, let's see:
    if (row.filter(cell => cell !== undefined && cell !== null && cell !== '').length === 1 && typeof row[0] === 'string') {
       if (row[0].includes('BTECH') || row[0].includes('B.Tech') || row[0].length < 15) {
            currentBatch = row[0];
            continue;
       }
    }

    // If it's a valid data row (has an ID and a Name)
    if (idIdx !== -1 && nameIdx !== -1 && row[idIdx] && row[nameIdx] && typeof row[idIdx] === 'string') {
      parsedStudents.push({
        id: String(row[idIdx]),
        name: String(row[nameIdx]),
        batch: currentBatch,
        branch: branchIdx !== -1 ? String(row[branchIdx]) : 'Unknown',
        year: yearIdx !== -1 ? String(row[yearIdx]) : '2',
        semester: semIdx !== -1 ? String(row[semIdx]) : '1',
        email: `${String(row[idIdx]).toLowerCase()}@student.univ.edu`,
        attendance: Math.floor(Math.random() * (100 - 75 + 1) + 75) + '%', // Generate mock attendance
        status: 'active'
      });
    }
  }

  fs.writeFileSync('parsed_students_clean.json', JSON.stringify(parsedStudents, null, 2));
  console.log(`Successfully extracted ${parsedStudents.length} students.`);
} catch (e) {
  console.error("Failed to read excel file", e);
}