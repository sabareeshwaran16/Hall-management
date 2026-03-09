const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
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
} = require('../controllers/admin.controller');

// All routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

// Exam routes
router.route('/exams')
    .get(getExams)
    .post(createExam);

router.route('/exams/:id')
    .put(updateExam)
    .delete(deleteExam);

// Hall routes
router.route('/halls')
    .get(getHalls)
    .post(createHall);

router.route('/halls/:id')
    .put(updateHall)
    .delete(deleteHall);

// Department routes
router.route('/departments')
    .get(getDepartments)
    .post(createDepartment);

router.route('/departments/:id')
    .put(updateDepartment)
    .delete(deleteDepartment);

// Student routes
router.route('/students')
    .get(getStudents);

router.route('/students/:id')
    .delete(deleteStudent);

router.post('/students/upload', upload.single('file'), uploadStudents);

// Allocation routes
router.post('/allocate/:examId', allocateSeats);
router.get('/allocations/:examId', getAllocations);
router.get('/allocations/:examId/stats', getAllocationStats);

// Invigilator routes
router.route('/invigilators')
    .post(assignInvigilator)
    .get(getInvigilators);

router.get('/invigilators/:examId', getInvigilators);

// Faculty routes
router.get('/faculty', getFaculty);
router.post('/faculty', createFaculty);
router.delete('/users/:id', deleteUser);

module.exports = router;
