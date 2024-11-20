const { generateReport } = require('../controllers/reportController');

const { fetchVolunteerData } = require('../services/volunteerService');
const { fetchEventData } = require('../services/eventService');

const { generateVolunteerPDF, generateVolunteerCSV, generateEventPDF, generateEventCSV } = require('../utils/reportGenerators');

jest.mock('../services/volunteerService');
jest.mock('../services/eventService');
jest.mock('../utils/reportGenerators');

const mockRes = () => {
  const res = {};
  res.setHeader = jest.fn();
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  res.download = jest.fn();
  res.pipe = jest.fn();
  return res;
};

describe('generateReport', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = mockRes();
  });

  it('should generate a volunteer report in PDF format', async () => {
    req.body = { reportType: 'volunteer', format: 'PDF', startDate: '2024-01-01', endDate: '2024-01-31' };
    const mockData = [{ name: 'John Doe', hours: 10 }];
    const mockDoc = { pipe: jest.fn() };

    fetchVolunteerData.mockResolvedValue(mockData);
    generateVolunteerPDF.mockResolvedValue(mockDoc);

    await generateReport(req, res);

    expect(fetchVolunteerData).toHaveBeenCalledWith(req, '2024-01-01', '2024-01-31');
    expect(generateVolunteerPDF).toHaveBeenCalledWith(mockData);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=volunteer_report.pdf');
    expect(mockDoc.pipe).toHaveBeenCalledWith(res);
  });

  it('should generate a volunteer report in CSV format', async () => {
    req.body = { reportType: 'volunteer', format: 'CSV', startDate: '2024-01-01', endDate: '2024-01-31' };
    const mockData = [{ name: 'John Doe', hours: 10 }];

    fetchVolunteerData.mockResolvedValue(mockData);
    generateVolunteerCSV.mockResolvedValue();

    await generateReport(req, res);

    expect(fetchVolunteerData).toHaveBeenCalledWith(req, '2024-01-01', '2024-01-31');
    expect(generateVolunteerCSV).toHaveBeenCalledWith(mockData);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=volunteer_report.csv');
    expect(res.download).toHaveBeenCalledWith('volunteer_report.csv');
  });

  it('should generate an event report in PDF format', async () => {
    req.body = { reportType: 'event', format: 'PDF', startDate: '2024-01-01', endDate: '2024-01-31' };
    const mockData = [{ eventName: 'Charity Run', attendees: 50 }];
    const mockDoc = { pipe: jest.fn() };

    fetchEventData.mockResolvedValue(mockData);
    generateEventPDF.mockResolvedValue(mockDoc);

    await generateReport(req, res);

    expect(fetchEventData).toHaveBeenCalledWith(req, '2024-01-01', '2024-01-31');
    expect(generateEventPDF).toHaveBeenCalledWith(mockData);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=event_report.pdf');
    expect(mockDoc.pipe).toHaveBeenCalledWith(res);
  });

  it('should generate an event report in CSV format', async () => {
    req.body = { reportType: 'event', format: 'CSV', startDate: '2024-01-01', endDate: '2024-01-31' };
    const mockData = [{ eventName: 'Charity Run', attendees: 50 }];
    const mockDoc = { pipe: jest.fn() };

    fetchEventData.mockResolvedValue(mockData);
    generateEventCSV.mockResolvedValue(mockDoc);

    await generateReport(req, res);

    expect(fetchEventData).toHaveBeenCalledWith(req, '2024-01-01', '2024-01-31');
    expect(generateEventCSV).toHaveBeenCalledWith(mockData);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=event_report.csv');
    expect(res.download).toHaveBeenCalledWith('event_report.csv');
  });

  it('should return 400 for invalid report type', async () => {
    req.body = { reportType: 'invalid', format: 'PDF', startDate: '2024-01-01', endDate: '2024-01-31' };

    await generateReport(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid report type' });
  });

  it('should return 500 for internal server error', async () => {
    req.body = { reportType: 'volunteer', format: 'PDF', startDate: '2024-01-01', endDate: '2024-01-31' };

    fetchVolunteerData.mockRejectedValue(new Error('Database error'));

    await generateReport(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
