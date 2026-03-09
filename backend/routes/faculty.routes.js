const express = require('express');
const router = express.Router();
const { protect, requireFaculty } = require('../middleware/auth');
const {
    getAssignedHalls,
    getSeatingLayout,
    downloadAttendanceSheet,
    downloadSeatingChart
} = require('../controllers/faculty.controller');

// All routes require authentication and faculty role
router.use(protect);
router.use(requireFaculty);

router.get('/assigned-halls', getAssignedHalls);
router.get('/seating/:examId/:hallId', getSeatingLayout);
router.get('/attendance/:examId/:hallId', downloadAttendanceSheet);
router.get('/seating-chart/:examId/:hallId', downloadSeatingChart);

module.exports = router;
