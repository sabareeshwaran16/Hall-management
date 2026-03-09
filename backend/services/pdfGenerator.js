const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFGenerator {

    /**
     * Generate Hall Ticket for a student
     */
    async generateHallTicket(allocation, student, exam) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const fileName = `hall_ticket_${student.rollNumber}_${exam._id}.pdf`;
                const filePath = path.join(__dirname, '../temp', fileName);

                // Ensure temp directory exists
                if (!fs.existsSync(path.join(__dirname, '../temp'))) {
                    fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
                }

                const stream = fs.createWriteStream(filePath);
                doc.pipe(stream);

                // Header
                doc.fontSize(20).font('Helvetica-Bold').text('EXAM HALL TICKET', { align: 'center' });
                doc.moveDown();

                // Exam Details
                doc.fontSize(14).font('Helvetica-Bold').text('Exam Details', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                doc.text(`Exam: ${exam.name}`);
                doc.text(`Date: ${new Date(exam.examDate).toLocaleDateString()}`);
                doc.text(`Session: ${exam.session === 'FN' ? 'Forenoon' : 'Afternoon'}`);
                doc.text(`Duration: ${exam.duration} minutes`);
                doc.moveDown();

                // Student Details
                doc.fontSize(14).font('Helvetica-Bold').text('Student Details', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                doc.text(`Name: ${student.name}`);
                doc.text(`Roll Number: ${student.rollNumber}`);
                doc.text(`Department: ${student.department.name}`);
                doc.text(`Year: ${student.year}`);
                doc.moveDown();

                // Hall Allocation
                doc.fontSize(14).font('Helvetica-Bold').text('Hall Allocation', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                doc.text(`Hall: ${allocation.hall.name}`);
                doc.text(`Building: ${allocation.hall.building}`);
                doc.text(`Seat Number: ${allocation.seatNumber}`);
                doc.text(`Row: ${allocation.row}, Column: ${allocation.column}`);
                doc.moveDown();

                // Instructions
                doc.fontSize(12).font('Helvetica-Bold').text('Instructions:', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(10).font('Helvetica');
                doc.list([
                    'Bring this hall ticket to the examination hall',
                    'Arrive 15 minutes before the exam starts',
                    'Carry a valid ID card',
                    'Mobile phones are strictly prohibited',
                    'Follow all examination rules and regulations'
                ]);

                // Footer
                doc.moveDown(2);
                doc.fontSize(9).text('This is a computer-generated document. No signature required.', { align: 'center', italics: true });

                doc.end();

                stream.on('finish', () => {
                    resolve(filePath);
                });

                stream.on('error', (error) => {
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Generate Seating Chart for a Hall
     */
    async generateSeatingChart(hallId, examId, allocations, hall) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
                const fileName = `seating_chart_${hall.name}_${examId}.pdf`;
                const filePath = path.join(__dirname, '../temp', fileName);

                if (!fs.existsSync(path.join(__dirname, '../temp'))) {
                    fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
                }

                const stream = fs.createWriteStream(filePath);
                doc.pipe(stream);

                // Header
                doc.fontSize(18).font('Helvetica-Bold').text(`Seating Chart - ${hall.name}`, { align: 'center' });
                doc.fontSize(12).font('Helvetica').text(`Building: ${hall.building}`, { align: 'center' });
                doc.moveDown();

                // Create seating grid
                const cellWidth = 80;
                const cellHeight = 40;
                const startX = 50;
                const startY = 120;

                doc.fontSize(8).font('Helvetica');

                // Draw seats
                allocations.forEach(allocation => {
                    const x = startX + (allocation.column - 1) * cellWidth;
                    const y = startY + (allocation.row - 1) * cellHeight;

                    // Draw cell
                    doc.rect(x, y, cellWidth, cellHeight).stroke();

                    // Add text
                    doc.text(allocation.rollNumber, x + 5, y + 5, { width: cellWidth - 10 });
                    doc.text(allocation.department.code, x + 5, y + 20, { width: cellWidth - 10 });
                });

                doc.end();

                stream.on('finish', () => {
                    resolve(filePath);
                });

                stream.on('error', (error) => {
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Generate Attendance Sheet
     */
    async generateAttendanceSheet(hallId, examId, allocations, hall, exam) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 40 });
                const fileName = `attendance_${hall.name}_${examId}.pdf`;
                const filePath = path.join(__dirname, '../temp', fileName);

                if (!fs.existsSync(path.join(__dirname, '../temp'))) {
                    fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
                }

                const stream = fs.createWriteStream(filePath);
                doc.pipe(stream);

                // Header
                doc.fontSize(16).font('Helvetica-Bold').text('ATTENDANCE SHEET', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).font('Helvetica');
                doc.text(`Exam: ${exam.name}`);
                doc.text(`Hall: ${hall.name}`);
                doc.text(`Date: ${new Date(exam.examDate).toLocaleDateString()}`);
                doc.text(`Session: ${exam.session}`);
                doc.moveDown();

                // Table header
                const tableTop = 180;
                const col1 = 50;
                const col2 = 100;
                const col3 = 250;
                const col4 = 400;
                const col5 = 480;

                doc.fontSize(10).font('Helvetica-Bold');
                doc.text('S.No', col1, tableTop);
                doc.text('Roll No', col2, tableTop);
                doc.text('Name', col3, tableTop);
                doc.text('Seat', col4, tableTop);
                doc.text('Signature', col5, tableTop);

                // Draw line
                doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke();

                // Table rows
                doc.font('Helvetica').fontSize(9);
                let yPosition = tableTop + 25;

                allocations.forEach((allocation, index) => {
                    if (yPosition > 700) {
                        doc.addPage();
                        yPosition = 50;
                    }

                    doc.text(index + 1, col1, yPosition);
                    doc.text(allocation.rollNumber, col2, yPosition);
                    doc.text(allocation.student.name, col3, yPosition, { width: 140 });
                    doc.text(allocation.seatNumber, col4, yPosition);

                    yPosition += 25;
                    doc.moveTo(col1, yPosition - 5).lineTo(550, yPosition - 5).stroke();
                });

                // Footer
                doc.moveDown(3);
                doc.fontSize(10).font('Helvetica');
                doc.text(`Total Students: ${allocations.length}`, 50);
                doc.moveDown();
                doc.text('Invigilator Signature: _____________________', 50);

                doc.end();

                stream.on('finish', () => {
                    resolve(filePath);
                });

                stream.on('error', (error) => {
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new PDFGenerator();
