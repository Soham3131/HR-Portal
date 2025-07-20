const express = require('express');
const router = express.Router();
const {
    getEmployeeProfile,
    updateEmployeeProfile,
    markAttendance,
    getAttendanceHistory,
    getAnnouncementsForEmployee,
    markAnnouncementsAsRead,
    applyForLeave,
    getLeaveHistory
} = require('../controllers/employeeController');
const { protectEmployee } = require('../middleware/authMiddleware');

router.get('/profile', protectEmployee, getEmployeeProfile);
router.put('/profile', protectEmployee, updateEmployeeProfile);
router.post('/attendance', protectEmployee, markAttendance);
router.get('/attendance', protectEmployee, getAttendanceHistory);
router.get('/announcements', protectEmployee, getAnnouncementsForEmployee);
router.post('/announcements/read', protectEmployee, markAnnouncementsAsRead);

router.post('/leave', protectEmployee, applyForLeave);
router.get('/leave/history', protectEmployee, getLeaveHistory)

module.exports = router;