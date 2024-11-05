const { generateReport } = require('../reportController');
const PDFDocument = require('pdfkit');
const fs = require('fs');

jest.mock('../../config/index');
jest.mock('pdfkit');
jest.mock('fs');
jest.mock('csv-writer');

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
