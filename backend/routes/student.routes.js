const express = require('express');
const router = express.Router();
const { protect, requireStudent } = require('../middleware/auth');
const {
    getTimetable,
    getSeatAllocation,
    downloadHallTicket,
    getMyAllocations
} = require('../controllers/student.controller');

// All routes require authentication and student role
router.use(protect);
router.use(requireStudent);

router.get('/timetable', getTimetable);
router.get('/allocation/:examId', getSeatAllocation);
router.get('/hall-ticket/:examId', downloadHallTicket);
router.get('/my-allocations', getMyAllocations);

module.exports = router;
