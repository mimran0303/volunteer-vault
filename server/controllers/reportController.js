const { fetchVolunteerData } = require('../services/volunteerService');
const { fetchEventData } = require('../services/eventService');

const {
    generateVolunteerPDF,
    generateVolunteerCSV,
    generateEventPDF,
    generateEventCSV,
} = require('../utils/reportGenerators');

exports.generateReport = async (req, res) => {
    const { reportType, format, startDate, endDate } = req.body;

    try {
        let data;
        switch (reportType) {
          case 'volunteer':
            data = await fetchVolunteerData(req, startDate, endDate); 
            if (format === 'PDF') {
              const doc = await generateVolunteerPDF(data);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=volunteer_report.pdf');
                doc.pipe(res);
            } else if (format === 'CSV') {
              await generateVolunteerCSV(data);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=volunteer_report.csv');
                res.download('volunteer_report.csv');
            }
            break;
          case 'event':
            data = await fetchEventData(req, startDate, endDate); 
            if (format === 'PDF') {
              const doc = await generateEventPDF(data);
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', 'attachment; filename=event_report.pdf');
              doc.pipe(res);
            } else if (format === 'CSV') {
              await generateEventCSV(data);
              res.setHeader('Content-Type', 'text/csv');
              res.setHeader('Content-Disposition', 'attachment; filename=event_report.csv');
              res.download('event_report.csv');
            }
            break;
          default:
            res.status(400).json({ message: 'Invalid report type' });
        }
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};