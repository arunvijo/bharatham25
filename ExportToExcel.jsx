import React from 'react';
import * as FileSaver from 'file-saver';
import XLSX from 'xlsx-js-style'; // REQUIRED: npm install xlsx-js-style
import { MdFileDownload } from 'react-icons/md';

export const ExportToExcel = ({ apiData, fileName }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (apiData, fileName) => {
    // Safety check
    if (!apiData || apiData.length === 0) {
      alert("No data to export");
      return;
    }

    // 1. Create Worksheet from the pre-processed (flattened) API Data
    const ws = XLSX.utils.json_to_sheet(apiData);

    // 2. Define Custom Column Widths
    const wscols = [
      { wch: 20 }, // Event Name
      { wch: 12 }, // House
      { wch: 25 }, // Team ID (Used for grouping)
      { wch: 8 },  // Team Size
      { wch: 25 }, // Participant Name
      { wch: 12 }, // UID
      { wch: 8 },  // Branch
      { wch: 8 },  // Semester
      { wch: 15 }, // Act Type
      { wch: 12 }, // Language
      { wch: 12 }, // Gender
      { wch: 15 }, // Dance/Instrument
      { wch: 20 }, // Registered At
    ];
    ws['!cols'] = wscols;

    // 3. APPLY STYLING (Colors & Borders)
    // We decode the range to iterate through every cell
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    let previousTeamId = null;
    let isGrey = false;

    // Iterate through Rows (starting from 1 to skip Header)
    for (let R = 1; R <= range.e.r; ++R) {
      // Logic: Check if "Team ID" column exists and has changed
      // Note: We need to find which column index maps to "Team ID". 
      // For simplicity, we check the data source directly by index.
      const rowData = apiData[R - 1]; // apiData is 0-indexed, Row 1 is index 0
      const currentTeamId = rowData ? rowData["Team ID"] : null;

      // Toggle Color if Team ID changes (Visual Grouping)
      if (currentTeamId && currentTeamId !== previousTeamId) {
        isGrey = !isGrey; 
        previousTeamId = currentTeamId;
      }
      // If no Team ID (individual events), just alternate every row
      else if (!currentTeamId) {
        isGrey = !isGrey;
      }

      // Define Row Style
      const rowStyle = {
        fill: {
          fgColor: { rgb: isGrey ? "F2F2F2" : "FFFFFF" } // Light Grey vs White
        },
        border: {
          top: { style: "thin", color: { rgb: "E0E0E0" } },
          bottom: { style: "thin", color: { rgb: "E0E0E0" } },
          left: { style: "thin", color: { rgb: "E0E0E0" } },
          right: { style: "thin", color: { rgb: "E0E0E0" } }
        },
        alignment: { vertical: "center", wrapText: true }
      };

      // Apply Style to every cell in this row
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        
        // Ensure cell object exists even if empty (for background color)
        if (!ws[cell_address]) {
           ws[cell_address] = { t: 's', v: '' }; 
        }

        // Merge existing style with new row style
        if (!ws[cell_address].s) ws[cell_address].s = {};
        ws[cell_address].s = { ...ws[cell_address].s, ...rowStyle };
      }
    }

    // 4. HEADER STYLING (Desi Saffron)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (ws[cell_address]) {
        ws[cell_address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
          fill: { fgColor: { rgb: "D97706" } }, // Saffron Color
          alignment: { horizontal: "center", vertical: "center" },
          border: { 
            bottom: { style: "medium", color: { rgb: "FFFFFF" } },
            right: { style: "thin", color: { rgb: "FFFFFF" } }
          }
        };
      }
    }

    // 5. Generate and Save File
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  // Render just the icon/button (Styling handled by parent class usually)
  return (
    <button 
      onClick={(e) => exportToCSV(apiData, fileName)} 
      className="w-full h-full flex items-center justify-center text-stone-500 hover:text-desi-teal transition-colors"
      title="Download Excel"
    >
      <MdFileDownload size={22} />
    </button>
  );
};