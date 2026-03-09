const Student = require('../models/Student');
const Allocation = require('../models/Allocation');
const Exam = require('../models/Exam');
const pdfGenerator = require('../services/pdfGenerator');
const fs = require('fs');

// @desc    Get student's exam timetable
// @route   GET /api/student/timetable
// @access  Student
const getTimetable = async (req, res) => {
    try {
        // Find student record
        const student = await Student.findOne({ userId: req.user.id }).populate('department');

        if (!student) {
            return res.status(404).json({ message: 'Student record not found' });
        }

        // Find all exams for student's department
        const exams = await Exam.find({
            departments: student.department._id,
            status: { $in: ['scheduled', 'allocated'] }
        }).sort({ examDate: 1 });

        res.json({ success: true, data: exams });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get student's seat allocation
// @route   GET /api/student/allocation/:examId
// @access  Student
const getSeatAllocation = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({ message: 'Student record not found' });
        }

        const allocation = await Allocation.findOne({
            exam: req.params.examId,
            student: student._id
        })
            .populate('hall')
            .populate('exam')
            .populate('department');

        if (!allocation) {
            return res.status(404).json({ message: 'Seat not allocated yet' });
        }

        res.json({ success: true, data: allocation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Download hall ticket
// @route   GET /api/student/hall-ticket/:examId
// @access  Student
const downloadHallTicket = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id }).populate('department');

        if (!student) {
            return res.status(404).json({ message: 'Student record not found' });
        }

        const allocation = await Allocation.findOne({
            exam: req.params.examId,
            student: student._id
        })
            .populate('hall')
            .populate('exam');

        if (!allocation) {
            return res.status(404).json({ message: 'Seat not allocated yet' });
        }

        const pdfPath = await pdfGenerator.generateHallTicket(
            allocation,
            student,
            allocation.exam
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

// @desc    Get all allocations for student
// @route   GET /api/student/my-allocations
// @access  Student
const getMyAllocations = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({ message: 'Student record not found' });
        }

        const allocations = await Allocation.find({ student: student._id })
            .populate('exam')
            .populate('hall')
            .sort({ 'exam.examDate': -1 });

        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getTimetable,
    getSeatAllocation,
    downloadHallTicket,
    getMyAllocations
};
