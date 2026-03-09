const Exam = require('../models/Exam');
const Hall = require('../models/Hall');
const Department = require('../models/Department');
const Student = require('../models/Student');
const User = require('../models/User');
const Invigilator = require('../models/Invigilator');
const Allocation = require('../models/Allocation');
const allocationEngine = require('../services/allocationEngine');
const csvParser = require('../services/csvParser');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// EXAM MANAGEMENT

// @desc    Create exam
// @route   POST /api/admin/exams
// @access  Admin
const createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json({ success: true, data: exam });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all exams
// @route   GET /api/admin/exams
// @access  Admin
const getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('departments').sort({ examDate: -1 });
        res.json({ success: true, data: exams });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update exam
// @route   PUT /api/admin/exams/:id
// @access  Admin
const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: exam });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete exam
// @route   DELETE /api/admin/exams/:id
// @access  Admin
const deleteExam = async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);
        await Allocation.deleteMany({ exam: req.params.id });
        res.json({ success: true, message: 'Exam deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// HALL MANAGEMENT

// @desc    Create hall
// @route   POST /api/admin/halls
// @access  Admin
const createHall = async (req, res) => {
    try {
        const hall = await Hall.create(req.body);
        res.status(201).json({ success: true, data: hall });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all halls
// @route   GET /api/admin/halls
// @access  Admin
const getHalls = async (req, res) => {
    try {
        const halls = await Hall.find().sort({ name: 1 });
        res.json({ success: true, data: halls });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update hall
// @route   PUT /api/admin/halls/:id
// @access  Admin
const updateHall = async (req, res) => {
    try {
        const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: hall });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete hall
// @route   DELETE /api/admin/halls/:id
// @access  Admin
const deleteHall = async (req, res) => {
    try {
        await Hall.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Hall deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DEPARTMENT MANAGEMENT

// @desc    Create department
// @route   POST /api/admin/departments
// @access  Admin
const createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Admin
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        res.json({ success: true, data: departments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update department
// @route   PUT /api/admin/departments/:id
// @access  Admin
const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: department });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete department
// @route   DELETE /api/admin/departments/:id
// @access  Admin
const deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Department deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// STUDENT MANAGEMENT

// @desc    Upload students CSV
// @route   POST /api/admin/students/upload
// @access  Admin
const uploadStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await csvParser.parseStudentCSV(req.file.path);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Admin
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('department').sort({ rollNumber: 1 });
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Admin
const deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ALLOCATION

// @desc    Trigger seat allocation
// @route   POST /api/admin/allocate/:examId
// @access  Admin
const allocateSeats = async (req, res) => {
    try {
        const result = await allocationEngine.allocateSeats(req.params.examId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Allocation failed', error: error.message });
    }
};

// @desc    Get allocation for exam
// @route   GET /api/admin/allocations/:examId
// @access  Admin
const getAllocations = async (req, res) => {
    try {
        const allocations = await Allocation.find({ exam: req.params.examId })
            .populate('student')
            .populate('hall')
            .populate('department')
            .sort({ hall: 1, seatNumber: 1 });

        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get allocation statistics
// @route   GET /api/admin/allocations/:examId/stats
// @access  Admin
const getAllocationStats = async (req, res) => {
    try {
        const stats = await allocationEngine.getAllocationStats(req.params.examId);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// INVIGILATOR MANAGEMENT

// @desc    Assign invigilator
// @route   POST /api/admin/invigilators
// @access  Admin
const assignInvigilator = async (req, res) => {
    try {
        console.log('Assigning Invigilator Body:', req.body);
        const invigilator = await Invigilator.create(req.body);
        res.status(201).json({ success: true, data: invigilator });
    } catch (error) {
        console.error('Invigilator Assignment Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get invigilators for exam or all
// @route   GET /api/admin/invigilators/:examId?
// @access  Admin
const getInvigilators = async (req, res) => {
    try {
        const query = req.params.examId ? { exam: req.params.examId } : {};
        const invigilators = await Invigilator.find(query)
            .populate('faculty')
            .populate('hall')
            .populate('exam');
        res.json({ success: true, data: invigilators });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all faculty users
// @route   GET /api/admin/faculty
// @access  Admin
const getFaculty = async (req, res) => {
    try {
        const faculty = await User.find({ role: 'faculty' }).sort({ name: 1 });
        res.json({ success: true, data: faculty });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create faculty user
// @route   POST /api/admin/faculty
// @access  Admin
const createFaculty = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'faculty'
        });

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createExam,
    getExams,
    updateExam,
    deleteExam,
    createHall,
    getHalls,
    updateHall,
    deleteHall,
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment,
    uploadStudents,
    getStudents,
    deleteStudent,
    allocateSeats,
    getAllocations,
    getAllocationStats,
    assignInvigilator,
    getInvigilators,
    getFaculty,
    createFaculty,
    deleteUser,
    upload
};
