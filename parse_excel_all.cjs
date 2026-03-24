const xlsx = require('xlsx');
const fs = require('fs');

const filePath = 'c:\\Users\\mahes\\Downloads\\Updated II year I sem Student Nominal Rolls with branch change list and Batchwise List @ 06-08-2024, 01.00PM.xlsx';

try {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  const parsedStudents = [];
  let currentBatch = 'Default Batch';
  let currentSection = 'Unknown Section';
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i].filter(cell => cell !== undefined && cell !== null && cell !== "");
    if (row.length === 0) continue;

    if (row.length === 1) {
      const val = String(row[0]).trim();
      if (val.includes(' - ') || val === 'CSE' || val === 'CSE-I' || val === 'CSE-J' || val.startsWith('CSE')) {
        currentSection = val;
      } else if (val.match(/^[A-Z0-9]+$/)) {
        currentBatch = val;
      }
      continue;
    }
    
    // Header row
    if (row.includes('Student Name') || row.includes('New HTNo')) {
        continue;
    }

    // It's a student row if the first index is a number (S.No) or there are more than 5 elements.
    if (row.length >= 7) {
      // Find the HTNo. It usually looks like "2303A..." or something alphanumeric. Let's rely on indices if they match the pattern.
      // S.No, AC Year, Year, Sem, Degree, Branch, Spl, New HTNo, Student Name
      // Sometimes columns are empty so they are omitted natively by filter(). 
      // Let's not use filter for extracting, just for checking row type.
      const rawRow = data[i];
      let id = "";
      let name = "";
      let branch = "";
      
      // Let's find columns based on string types. 
      // Id is usually something like 2303A51002 (length 10).
      for (let j = 0; j < rawRow.length; j++) {
        const cell = String(rawRow[j] || "").trim();
        if (cell.match(/^[0-9A-Z]{10}$/)) {
            id = cell;
            name = String(rawRow[j + 1] || "").trim();
            break;
        }
      }
      
      if (!id) {
          // Fallback based on typical indices
          id = String(rawRow[7] || "").trim();
          name = String(rawRow[8] || "").trim();
      }
      
      branch = String(rawRow[5] || "").trim() || "CSE";

      if (id && name && id !== "undefined" && name !== "undefined") {
        parsedStudents.push({
          id: id,
          name: name,
          batch: currentBatch,
          branch: branch,
          year: "2",
          semester: "1",
          email: `${id.toLowerCase()}@student.univ.edu`,
          attendance: Math.floor(Math.random() * (100 - 75 + 1) + 75) + '%',
          status: 'active'
        });
      }
    }
  }

  fs.writeFileSync('parsed_students_all.json', JSON.stringify(parsedStudents, null, 2));
  console.log(`Successfully extracted ${parsedStudents.length} students.`);
} catch (e) {
  console.error("Failed to read excel file", e);
}