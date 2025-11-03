import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import { flatten } from "flat";

export const ExportToExcel = ({ apiData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    // Columns to exclude
    const columnsToExclude = [
      'participants.0.individualParticipation.offstage',
      'participants.0.individualParticipation.onstage',
      'participants.0.individualParticipation.onstageLiterary',
      'participants.0.individualParticipation.offstageLiterary',
      'participants.0.groupParticipation.offstage',
      'participants.0.groupParticipation.onstage',
      'participants.0.groupParticipation.offstageLiterary',
      'participants.0.groupParticipation.onstageLiterary'
    ];

    // Process the data to create separate rows for each participant
    const processedData = apiData.flatMap(registration => {
      const baseRegistration = { ...registration };
      delete baseRegistration.participants; // Remove participants array from base registration

      // If there are no participants, return just the base registration
      if (!registration.participants || registration.participants.length === 0) {
        return [baseRegistration];
      }

      // Create a row for each participant
      return registration.participants.map((participant, index) => {
        const participantData = {
          ...baseRegistration,
          'Participant Name': participant.fullName,
          'UID': participant.uid,
          'Branch': participant.branch,
          'Semester': participant.semester,
          'House': participant.house,
          'Individual Count': participant.individual || 0,
          'Group Count': participant.group || 0,
          'Literary Count': participant.literary || 0,
          'Participant Number': index + 1
        };

        // Add chest no. and verify columns for registration exports
        if (fileName.toLowerCase().includes('registration')) {
          participantData['chest no.'] = '';
          participantData['verified'] = '';
        }

        return participantData;
      });
    });

    // Create worksheet with the processed data
    const ws = XLSX.utils.json_to_sheet(processedData);
    
    // Set column widths
    const colWidths = [
      { wch: 20 }, // Event Name
      { wch: 15 }, // Category
      { wch: 15 }, // Participation
      { wch: 15 }, // Type
      { wch: 15 }, // Date
      { wch: 20 }, // Venue
      { wch: 20 }, // Participant Name
      { wch: 15 }, // UID
      { wch: 15 }, // Branch
      { wch: 10 }, // Semester
      { wch: 15 }, // House
      { wch: 15 }, // Individual Count
      { wch: 15 }, // Group Count
      { wch: 15 }, // Literary Count
      { wch: 10 }, // Participant Number
      { wch: 10 }, // chest no.
      { wch: 10 }  // verified
    ];
    ws['!cols'] = colWidths;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button onClick={(e) => exportToCSV(apiData, fileName)}>Export</button>
  );
};
