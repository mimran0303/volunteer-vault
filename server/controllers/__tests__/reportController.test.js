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
  
  
  jest.mock('../../config/index', () => jest.fn());
  jest.mock('fs');
  jest.mock('pdfkit-table');
  
  describe('Report Controller', () => {
  
    describe('fetchVolunteerData', () => {
      let mockQuery;
      let mockEnd;

      beforeEach(() => {
        mockQuery = jest.fn();
        mockEnd = jest.fn();
        
        db.mockResolvedValue({
          query: mockQuery,
          end: mockEnd,
        });
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should fetch volunteer data within the date range and for the specified admin', async () => {
        const req = { user: { userId: 1 } }; // Mocked request object
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';
        const mockData = [
          {
            volunteer_id: 1,
            event_id: 2,
            participation_status: 'completed',
            rating: 5,
            volunteer_name: 'John Doe',
            event_name: 'Charity Run',
            event_admin_id: 1,
            event_date: '2024-05-20',
          },
        ];

        mockQuery.mockResolvedValue([mockData]);

        const result = await fetchVolunteerData(req, startDate, endDate);

        expect(db).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining('SELECT'),
          [startDate, endDate, req.user.userId]
        );
        expect(result).toEqual(mockData);
        expect(mockEnd).toHaveBeenCalledTimes(1);
      });

      it('should return null and log an error if the query fails', async () => {
        console.error = jest.fn();
        mockQuery.mockRejectedValue(new Error('Query failed'));

        const req = { user: { userId: 1 } };
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';

        const result = await fetchVolunteerData(req, startDate, endDate);

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error));
        expect(mockEnd).toHaveBeenCalledTimes(0); // If query fails, end might not be called
      });
    });



    describe('fetchEventData', () => {
      let mockQuery;
      let mockEnd;
    
      beforeEach(() => {
        mockQuery = jest.fn();
        mockEnd = jest.fn();
        
        db.mockResolvedValue({
          query: mockQuery,
          end: mockEnd,
        });
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });
    
      it('should fetch event data within the specified date range and for the specified admin', async () => {
        const req = { user: { userId: 1 } }; // Mocked request object
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';
        const mockData = [
          {
            event_id: 1,
            event_name: 'Charity Event',
            event_description: 'Annual charity fundraiser',
            location: 'Main Street',
            city: 'Houston',
            state: 'TX',
            zip_code: '77001',
            required_skills: 'Fundraising',
            urgency: 'High',
            event_date: '2024-05-20',
            is_concluded: 0,
            volunteer_id: 101,
            volunteer_name: 'John Doe',
            is_reviewed: 1,
          },
        ];
    
        mockQuery.mockResolvedValue([mockData]);
    
        const result = await fetchEventData(req, startDate, endDate);
    
        expect(db).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining('SELECT'),
          [startDate, endDate, req.user.userId]
        );
        expect(result).toEqual(mockData);
        expect(mockEnd).toHaveBeenCalledTimes(1);
      });
    
      it('should return null and log an error if the query fails', async () => {
        console.error = jest.fn();
        mockQuery.mockRejectedValue(new Error('Query failed'));
    
        const req = { user: { userId: 1 } };
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';
    
        const result = await fetchEventData(req, startDate, endDate);
    
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Error fetching event data:', expect.any(Error));
        expect(mockEnd).toHaveBeenCalledTimes(0); // End might not be called if query fails
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
  
    

  });
  