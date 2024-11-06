const db = require('../config/index');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

// VolunteerHistory, UserProfile
// fetch list of volunteers and their participation history.
const fetchVolunteerData = async (startDate, endDate) => {
  try {
    const db_con = await db();
    // console.log("Database connected successfully");

    // Fetch volunteer history details with necessary joins
    const [rows] = await db_con.query(`
        SELECT 
          vh.volunteer_id,
          vh.event_id,
          vh.participation_status,
          vh.rating,
          up.full_name AS volunteer_name,
          ed.event_name,
          ed.event_admin_id,
          ed.event_date
        FROM 
            volunteerhistory vh
        JOIN 
            userprofile up ON vh.volunteer_id = up.profile_owner_id
        JOIN 
            eventdetails ed ON vh.event_id = ed.event_id
        ORDER BY vh.volunteer_id
    `);

    await db_con.end();
    
    return rows;
  } catch (error) {
      // console.error("Error fetching volunteer history:", error);
     return null;
  }
};

// VolunteerMatch, EventDetails
// fetch admin's ongoing events details and volunteer assignments
const fetchEventData = async (startDate, endDate) => {
    console.log('Fetching event data...');
    return []; 
};

// Gabriel
const generateVolunteerPDF = async (data) => {
  console.log('Generating volunteer PDF...');
  
  const doc = new PDFDocument();
  
  // Pipe to a file (for testing) or directly to a response in production
  doc.pipe(fs.createWriteStream('volunteer_report.pdf'));

  // title
  doc.fontSize(18).text('Volunteer Participation Report', { align: 'center' });
  doc.moveDown();

  // Define column headers
  const tableHeaders = ['Volunteer Name', 'Event Name', 'Event Date', 'Participation Status', 'Rating'];

  // Print headers
  doc.fontSize(12).text(
      tableHeaders.join(' | '), 
      { underline: true, align: 'left' }
  );
  doc.moveDown(0.5);

  // Iterate over the data and print rows
  data.forEach(row => {
      const eventDate = new Date(row.event_date).toLocaleDateString();
      const rowData = [
          row.volunteer_name,
          row.event_name,
          eventDate,
          row.participation_status,
          row.rating
      ].join(' | ');

      doc.text(rowData);
  });

  // End the document
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
            data = await fetchEventData(startDate, endDate); 
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
