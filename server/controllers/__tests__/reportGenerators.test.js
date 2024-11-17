const { 
    generateVolunteerPDF,
    generateVolunteerCSV,
    generateEventPDF,
    generateEventCSV,
  } = require('../../utils/reportGenerators');

const PDFDocument = require("pdfkit-table");
const fs = require('fs');

jest.mock('fs');
jest.mock('pdfkit-table');

describe('Report Generators', () => {
    describe('generateVolunteerPDF', () => {
      it('should generate a PDF document', async () => {
        const data = [{ volunteer_name: 'John Doe', event_name: 'Event A', event_date: '2023-01-01', participation_status: 'participated', rating: 4.5 }];
        const mockDoc = {
          pipe: jest.fn(),
          fontSize: jest.fn().mockReturnThis(),
          text: jest.fn().mockReturnThis(),
          moveDown: jest.fn().mockReturnThis(),
          table: jest.fn().mockResolvedValue(),
          font: jest.fn().mockReturnThis(),
          fillColor: jest.fn().mockReturnThis(),
          end: jest.fn(),
        };
        PDFDocument.mockReturnValue(mockDoc);
        await generateVolunteerPDF(data);
        expect(mockDoc.text).toHaveBeenCalledWith('Volunteer Participation Report', { align: 'center' });
        expect(mockDoc.end).toHaveBeenCalled();
      });
    });
  
    describe('generateVolunteerCSV', () => {
      it('should generate a CSV file', async () => {
        const data = [{ volunteer_name: 'John Doe', event_name: 'Event A', event_date: '2023-01-01', participation_status: 'participated', rating: 4.5 }];
        fs.writeFileSync.mockReturnValue();
        await generateVolunteerCSV(data);
        expect(fs.writeFileSync).toHaveBeenCalledWith('volunteer_report.csv', expect.any(String));
      });
    });
  
    describe('generateEventPDF', () => {
      it('should generate an Event PDF document', async () => {
        const data = [{ volunteer_name: 'John Doe', event_name: 'Event A', event_date: '2023-01-01', location: 'City', required_skills: 'Skill' }];
        const mockDoc = {
          pipe: jest.fn(),
          fontSize: jest.fn().mockReturnThis(),
          text: jest.fn().mockReturnThis(),
          moveDown: jest.fn().mockReturnThis(),
          table: jest.fn().mockResolvedValue(),
          font: jest.fn().mockReturnThis(),
          end: jest.fn(),
        };
        PDFDocument.mockReturnValue(mockDoc);
        await generateEventPDF(data);
        expect(mockDoc.text).toHaveBeenCalledWith('Volunteer Event Assignments', { align: 'center' });
        expect(mockDoc.end).toHaveBeenCalled();
      });
    });
  
    describe('generateEventCSV', () => {
      it('should generate an Event CSV file', async () => {
        const data = [{ event_id: 1, event_name: 'Event A', event_date: '2023-01-01' }];
        fs.writeFileSync.mockReturnValue();
        await generateEventCSV(data);
        expect(fs.writeFileSync).toHaveBeenCalledWith('event_report.csv', expect.any(String));
      });
    });
});