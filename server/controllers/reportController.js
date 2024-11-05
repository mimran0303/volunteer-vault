const db = require('../config/index');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const fetchVolunteerData = async (startDate, endDate) => {
    console.log('Fetching volunteer data...');
    return []; 
};

const fetchEventData = async (startDate, endDate) => {
    console.log('Fetching event data...');
    return []; 
};

// Gabriel
const generateVolunteerPDF = async (data) => {
    console.log('Generating volunteer PDF...');
    const doc = new PDFDocument();
    doc.text('Hello from Volunteer PDF');
    doc.end();
    return doc;
};

// Shruthi
const generateVolunteerCSV = async (data) => {
    console.log('Hello from Volunteer CSV');
    fs.writeFileSync('volunteer_report.csv', 'Hello from Volunteer CSV\n');
};

// Tristan
const generateEventPDF = async (data) => {
    console.log('Generating event PDF...');
    const doc = new PDFDocument();
    doc.text('Hello from Event PDF');
    doc.end();
    return doc;
};

// Mariam
const generateEventCSV = async (data) => {
    console.log('Hello from Event CSV');
    fs.writeFileSync('event_report.csv', 'Hello from Event CSV\n');
};

exports.generateReport = async (req, res) => {
    const { reportType, format, startDate, endDate } = req.body;

    try {
        let data;
        switch (reportType) {
          case 'volunteer':
            data = await fetchVolunteerData(startDate, endDate); 
            if (format === 'PDF') {
              const doc = await generateVolunteerPDF(data);
              res.setHeader('Content-Type', 'application/pdf');
              doc.pipe(res);
            } else if (format === 'CSV') {
              await generateVolunteerCSV(data);
              res.download('volunteer_report.csv');
            }
            break;
          case 'event':
            data = await fetchEventData(startDate, endDate); 
            if (format === 'PDF') {
              const doc = await generateEventPDF(data);
              res.setHeader('Content-Type', 'application/pdf');
              doc.pipe(res);
            } else if (format === 'CSV') {
              await generateEventCSV(data);
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
