// reportController.test.js

const {
    fetchVolunteerData,
    fetchEventData,
    generateVolunteerPDF,
    generateVolunteerCSV,
    generateEventPDF,
    generateEventCSV,
    generateReport,
  } = require('../reportController');
  
  const db = require('../../config/index');
  const PDFDocument = require("pdfkit-table");
  const fs = require('fs');
  
  
  jest.mock('../../config/index');
  jest.mock('fs');
  jest.mock('pdfkit-table');
  
  describe('Report Controller', () => {
    const mockDb = {
      query: jest.fn(),
      end: jest.fn(),
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
      db.mockResolvedValue(mockDb);
    });
  
    describe('fetchVolunteerData', () => {
      it('should fetch volunteer data from the database', async () => {
        mockDb.query.mockResolvedValue([[{ volunteer_id: 1, event_name: 'Event A' }]]);
        const req = { user: { userId: 1 } };
        const data = await fetchVolunteerData(req, '2023-01-01', '2023-01-31');
        expect(mockDb.query).toHaveBeenCalledWith(expect.any(String), ['2023-01-01', '2023-01-31', 1]);
        expect(data).toEqual([{ volunteer_id: 1, event_name: 'Event A' }]);
      });
  
      it('should return null if there is an error', async () => {
        mockDb.query.mockRejectedValue(new Error('DB Error'));
        const req = { user: { userId: 1 } };
        const data = await fetchVolunteerData(req, '2023-01-01', '2023-01-31');
        expect(data).toBeNull();
      });
    });
  
    describe('fetchEventData', () => {
      it('should fetch event data from the database', async () => {
        mockDb.query.mockResolvedValue([[{ event_id: 1, event_name: 'Event A' }]]);
        const req = { user: { userId: 1 } };
        const data = await fetchEventData(req, '2023-01-01', '2023-01-31');
        expect(mockDb.query).toHaveBeenCalledWith(expect.any(String), ['2023-01-01', '2023-01-31', 1]);
        expect(data).toEqual([{ event_id: 1, event_name: 'Event A' }]);
      });
  
      it('should return null if there is an error', async () => {
        mockDb.query.mockRejectedValue(new Error('DB Error'));
        const req = { user: { userId: 1 } };
        const data = await fetchEventData(req, '2023-01-01', '2023-01-31');
        expect(data).toBeNull();
      });
    });
  
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
  
    describe('generateReport', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: {
                    reportType: '',
                    format: '',
                    startDate: '2023-01-01',
                    endDate: '2023-01-31'
                }
            };
    
            res = {
                setHeader: jest.fn(),
                download: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                pipe: jest.fn()
            };
        });

        // ! FAIL
        it('should generate a PDF for volunteer report', async () => {
            req.body.reportType = 'volunteer';
            req.body.format = 'PDF';
    
            PDFDocument.prototype.pipe = jest.fn();
            PDFDocument.prototype.text = jest.fn();
            PDFDocument.prototype.end = jest.fn();
    
            await generateReport(req, res);
    
            expect(PDFDocument.prototype.text).toHaveBeenCalledWith('Hello from Volunteer PDF');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=volunteer_report.pdf');
            expect(PDFDocument.prototype.pipe).toHaveBeenCalledWith(res);
        });
    
        // ! FAIL
        it('should generate a CSV for volunteer report', async () => {
            req.body.reportType = 'volunteer';
            req.body.format = 'CSV';
    
            fs.writeFileSync = jest.fn();
    
            await generateReport(req, res);
    
            expect(fs.writeFileSync).toHaveBeenCalledWith('volunteer_report.csv', 'Hello from Volunteer CSV\n');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=volunteer_report.csv');
            expect(res.download).toHaveBeenCalledWith('volunteer_report.csv');
        });
    
        it('should handle invalid report type', async () => {
            req.body.reportType = 'invalid';
    
            await generateReport(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid report type' });
        });
    
        it('should handle errors gracefully', async () => {
            req.body.reportType = 'volunteer';
            req.body.format = 'PDF';
    
            PDFDocument.prototype.text.mockImplementation(() => {
                throw new Error('PDF generation error');
            });
    
            await generateReport(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
      });
  });
  