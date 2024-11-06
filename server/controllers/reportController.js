const db = require('../config/index');
const PDFDocument = require("pdfkit-table");
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');


// VolunteerHistory, UserProfile
// fetch list of volunteers and their participation history.
// ! maybe filter by locality. state and city
const fetchVolunteerData = async (req, startDate, endDate) => {
  try {
    const db_con = await db();

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
        WHERE
          ed.event_date BETWEEN ? AND ?
        AND 
          ed.event_admin_id = ?
        ORDER BY 
          vh.volunteer_id
    `, [startDate, endDate, req.user.userId]);

    await db_con.end();
    
    return rows;
  } catch (error) {
      // console.error("Error fetching volunteer history:", error);
     return null;
  }
};

// VolunteerMatch, EventDetails
// fetch admin's ongoing events details and volunteer assignments
const fetchEventData = async (req, startDate, endDate) => {
    console.log('Fetching event data...');
    return []; 
};

// Gabriel
const generateVolunteerPDF = async (data) => {
  const doc = new PDFDocument({ margin: 30 });

  // Pipe to file
  doc.pipe(fs.createWriteStream('volunteer_report.pdf'));

  // Title
  doc.fontSize(18).text('Volunteer Participation Report', { align: 'center' });
  doc.moveDown(2);

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
      doc.fontSize(14).text(`Volunteer: ${volunteerName}`, { underline: true });
      doc.moveDown(0.5);

      // Prepare table headers and rows
      const headers = ['Event Name', 'Event Date', 'Participation Status', 'Rating'];
      const rowsData = rows.map(row => [
          row.event_name,
          new Date(row.event_date).toLocaleDateString(),
          row.participation_status,
          row.rating.toFixed(1) 
      ]);

      // Add a table for this volunteer
      await doc.table({
          title: `Participation Details for ${volunteerName}`, 
          headers: headers,
          rows: rowsData,
      }, {
          width: 500, 
          prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
          prepareRow: (row, indexColumn) => doc.font('Helvetica').fontSize(10),
      });

      // Calculate and display stats
      const totalRatings = rows.reduce((sum, row) => sum + row.rating, 0);
      const participations = rows.filter(row => row.participation_status === 'participated').length;
      const noShows = rows.filter(row => row.participation_status === 'no-show').length;
      const attendanceRating = ((participations / (participations + noShows)) * 100).toFixed(2) + '%';
      const averageRating = (totalRatings / rows.length).toFixed(2);

      doc.moveDown(0.5);

      doc.fontSize(12).font('Helvetica-Bold').text('Summary:', { underline: true });
      doc.moveDown(0.3); 

      doc.fontSize(11).font('Helvetica').fillColor('black');
      doc.text(`No-shows: ${noShows}`);
      doc.text(`Participations: ${participations}`);
      doc.text(`Attendance Rate: ${attendanceRating}`);
      doc.text(`Average Volunteer Rating: ${averageRating}`);
      doc.moveDown(1);

  }

  doc.fontSize(10).text('Generated on: ' + new Date().toLocaleString(), { align: 'right' });

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
