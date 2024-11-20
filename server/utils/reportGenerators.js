const PDFDocument = require('pdfkit-table'); // Example for PDFs
const fs = require('fs');
const { parse } = require('json2csv'); // Example for CSV

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
    try {
        // Define the CSV fields based on Gabriel's query structure
        const fields = [
            { label: 'Volunteer ID', value: 'volunteer_id' },
            { label: 'Event ID', value: 'event_id' },
            { label: 'Participation Status', value: 'participation_status' },
            { label: 'Rating', value: 'rating' },
            { label: 'Volunteer Name', value: 'volunteer_name' },
            { label: 'Event Name', value: 'event_name' },
            { label: 'Event Admin ID', value: 'event_admin_id' },
            { label: 'Event Date', value: row => new Date(row.event_date).toLocaleDateString() },
        ];

        // Convert data to CSV format
        const csv = parse(data, { fields });

        // Write the CSV content to a file
        fs.writeFileSync('volunteer_report.csv', csv);
        console.log('Event CSV file generated successfully at: volunteer_report.csv');
    } catch (error) {
        console.error('Error generating Volunteer CSV:', error);
    }
    console.log(data)
};
  
// Tristan
const generateEventPDF = async (data) => {
    console.log('Generating Event PDF...');
    const doc = new PDFDocument({ margin: 30 });
    doc.pipe(fs.createWriteStream('event_management_report.pdf'));

    // Title
    doc.fontSize(18).text('Volunteer Event Assignments', { align: 'center' });
    doc.moveDown(2);

    // Group data by volunteer_name
    const groupedData = data.reduce((acc, row) => {
        if (!acc[row.volunteer_name]) {
            acc[row.volunteer_name] = [];
        }
        acc[row.volunteer_name].push(row);
        return acc;
    }, {});

    // Generate report for each volunteer
    for (const [volunteerName, events] of Object.entries(groupedData)) {
        // Volunteer header
        doc.fontSize(14).font('Helvetica-Bold').text(`Volunteer: ${volunteerName}`, { underline: true });
        doc.moveDown(0.5);

        // Table headers for events
        const headers = ['Event Name', 'Date', 'Location', 'Required Skills'];
        const rowsData = events.map(event => [
            event.event_name,
            new Date(event.event_date).toLocaleDateString(),
            `${event.city}, ${event.state} ${event.zip_code}`,
            event.required_skills 
        ]);

        // Add the event table for this volunteer
        await doc.table({
            // title: `Events Assigned to ${volunteerName}`,
            headers: headers,
            rows: rowsData,
        }, {
            width: 500,
            prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
            prepareRow: (row, indexColumn) => doc.font('Helvetica').fontSize(10),
        });

        doc.moveDown(1);
    }

    // Footer with generation date
    doc.fontSize(10).text('Generated on: ' + new Date().toLocaleString(), { align: 'right' });
    doc.end();

    console.log('PDF generated successfully at: event_management_report.pdf');
    return doc;
};
  
const generateEventCSV = async (data) => {
    try {
        // Define the CSV fields based on Tristan's query structure
        const fields = [
            { label: 'Event ID', value: 'event_id' },
            { label: 'Event Name', value: 'event_name' },
            { label: 'Event Description', value: 'event_description' },
            { label: 'Location', value: 'location' },
            { label: 'City', value: 'city' },
            { label: 'State', value: 'state' },
            { label: 'Zip Code', value: 'zip_code' },
            { label: 'Required Skills', value: 'required_skills' },
            { label: 'Urgency', value: 'urgency' },
            { label: 'Event Date', value: row => new Date(row.event_date).toLocaleDateString() },
            { label: 'Is Concluded', value: row => row.is_concluded ? 'Yes' : 'No' },
            { label: 'Volunteer ID', value: 'volunteer_id' },
            { label: 'Volunteer Name', value: 'volunteer_name' },
            { label: 'Is Reviewed', value: row => row.is_reviewed ? 'Yes' : 'No' }
        ];

        // Convert data to CSV format
        const csv = parse(data, { fields });

        // Write the CSV content to a file
        fs.writeFileSync('event_report.csv', csv);
        console.log('Event CSV file generated successfully at: event_report.csv');
    } catch (error) {
        console.error('Error generating Event CSV:', error);
    }
    console.log(data)
};

module.exports = {
    generateVolunteerPDF,
    generateVolunteerCSV,
    generateEventPDF,
    generateEventCSV,
};