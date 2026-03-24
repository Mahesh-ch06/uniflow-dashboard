const xlsx = require('xlsx');
const fs = require('fs');

const filePath = 'c:\\Users\\mahes\\Downloads\\Updated II year I sem Student Nominal Rolls with branch change list and Batchwise List @ 06-08-2024, 01.00PM.xlsx';

try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  let out = '';
  for (let i = 0; i < Math.min(data.length, 100); i++) {
    out += JSON.stringify(data[i]) + '\n';
  }
  fs.writeFileSync('excel_dump.txt', out);
  console.log('Dumped first 100 rows');
} catch (e) {
  console.error("Failed to read excel file", e);
}