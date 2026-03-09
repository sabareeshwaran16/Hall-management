const Invigilator = require('../models/Invigilator');
const Allocation = require('../models/Allocation');
const Exam = require('../models/Exam');
const Hall = require('../models/Hall');
const pdfGenerator = require('../services/pdfGenerator');
const fs = require('fs');

// @desc    Get assigned halls for faculty
// @route   GET /api/faculty/assigned-halls
// @access  Faculty
const getAssignedHalls = async (req, res) => {
    try {
        const assignments = await Invigilator.find({ faculty: req.user.id })
            .populate('exam')
            .populate('hall')
            .sort({ 'exam.examDate': -1 });

        res.json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get seating layout for assigned hall
// @route   GET /api/faculty/seating/:examId/:hallId
// @access  Faculty
const getSeatingLayout = async (req, res) => {
    try {
        const { examId, hallId } = req.params;

        // Verify faculty is assigned to this hall
        const assignment = await Invigilator.findOne({
            faculty: req.user.id,
            exam: examId,
            hall: hallId
        });

        if (!assignment) {
            return res.status(403).json({ message: 'Not authorized to view this hall' });
        }

        const allocations = await Allocation.find({ exam: examId, hall: hallId })
            .populate('student')
            .populate('department')
            .sort({ seatNumber: 1 });

        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Download attendance sheet
// @route   GET /api/faculty/attendance/:examId/:hallId
// @access  Faculty
const downloadAttendanceSheet = async (req, res) => {
    try {
        const { examId, hallId } = req.params;

        // Verify faculty is assigned to this hall
        const assignment = await Invigilator.findOne({
            faculty: req.user.id,
            exam: examId,
            hall: hallId
        });

        if (!assignment) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const allocations = await Allocation.find({ exam: examId, hall: hallId })
            .populate('student')
            .populate('department')
            .sort({ seatNumber: 1 });

        const hall = await Hall.findById(hallId);
        const exam = await Exam.findById(examId);

        const pdfPath = await pdfGenerator.generateAttendanceSheet(
            hallId,
            examId,
            allocations,
            hall,
            exam
        );

        res.download(pdfPath, (err) => {
            if (err) {
                console.error(err);
            }
            // Clean up file after download
            fs.unlinkSync(pdfPath);
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Download seating chart
// @route   GET /api/faculty/seating-chart/:examId/:hallId
// @access  Faculty
const downloadSeatingChart = async (req, res) => {
    try {
        const { examId, hallId } = req.params;

        // Verify faculty is assigned to this hall
        const assignment = await Invigilator.findOne({
            faculty: req.user.id,
            exam: examId,
            hall: hallId
        });

        if (!assignment) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const allocations = await Allocation.find({ exam: examId, hall: hallId })
            .populate('department')
            .sort({ seatNumber: 1 });

        const hall = await Hall.findById(hallId);

        const pdfPath = await pdfGenerator.generateSeatingChart(
            hallId,
            examId,
            allocations,
            hall
        );

        res.download(pdfPath, (err) => {
            if (err) {
                console.error(err);
            }
            fs.unlinkSync(pdfPath);
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAssignedHalls,
    getSeatingLayout,
    downloadAttendanceSheet,
    downloadSeatingChart
};
