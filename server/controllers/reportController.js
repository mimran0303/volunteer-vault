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

  // Title
  doc.fontSize(18).text('Volunteer Participation Report', { align: 'center' });
  doc.moveDown();

  // Group data by volunteer_name
  const groupedData = data.reduce((acc, row) => {
      if (!acc[row.volunteer_name]) {
          acc[row.volunteer_name] = [];
      }
      acc[row.volunteer_name].push(row);
      return acc;
  }, {});

  // Iterate over each volunteer group and create a separate table
  for (const [volunteerName, rows] of Object.entries(groupedData)) {
      // Volunteer name as a subheading
      doc.fontSize(14).text(`Volunteer: ${volunteerName}`, { underline: true });
      doc.moveDown(0.5);

      // Table headers
      const tableHeaders = ['Event Name', 'Event Date', 'Participation Status', 'Rating'];
      doc.fontSize(12).text(tableHeaders.join(' | '), { align: 'left' });
      doc.moveDown(0.3);

      // Print rows for the volunteer
      let totalRatings = 0;
      let participations = 0;
      let noShows = 0;

      rows.forEach(row => {
          const eventDate = new Date(row.event_date).toLocaleDateString();
          const rowData = [
              row.event_name,
              eventDate,
              row.participation_status,
              row.rating
          ].join(' | ');

          doc.text(rowData);

          // Update statistics
          totalRatings += row.rating;
          if (row.participation_status === 'participated') {
              participations++;
          } else if (row.participation_status === 'no-show') {
              noShows++;
          }
      });

      const attendanceRating = ((participations / (participations + noShows)) * 100).toFixed(2) + '%';
      const averageRating = (totalRatings / rows.length).toFixed(2);

      doc.moveDown(0.5);
      doc.fontSize(12).text(`No-shows: ${noShows}`);
      doc.text(`Participations: ${participations}`);
      doc.text(`Attendance Rate: ${attendanceRating}`);
      doc.text(`Average Volunteer Rating: ${averageRating}`);
      doc.moveDown(1); // Add space after stats
  }

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
