const xlsx = require('xlsx');
const fs = require('fs');

const filePath = 'c:\\Users\\mahes\\Downloads\\Updated II year I sem Student Nominal Rolls with branch change list and Batchwise List @ 06-08-2024, 01.00PM.xlsx';

try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming first sheet
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  fs.writeFileSync('parsed_students.json', JSON.stringify(data.slice(0, 10), null, 2)); // Save only the first 10 for quick inspection
  console.log('Successfully written an excerpt to parsed_students.json. Total rows: ' + data.length);
} catch (e) {
  console.error("Failed to read excel file", e);
}