// controllers/employeeController.js
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const generateToken = require('../utils/generateToken');
const Announcement = require('../models/Announcement');
const LoginRecord = require('../models/LoginRecord');
const LeaveRequest = require('../models/LeaveRequest');


// @desc    Get logged-in employee's profile
exports.getEmployeeProfile = async (req, res) => {
    const employee = await Employee.findById(req.user.id).select('-password');
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
};

exports.updateEmployeeProfile = async (req, res) => {
    const employee = await Employee.findById(req.user.id);

    if (employee) {
        employee.name = req.body.name || employee.name;
        employee.phone = req.body.phone || employee.phone;
        employee.address = req.body.address || employee.address;
        
        // Handle new profile picture and document URLs
        if(req.body.profilePictureUrl) employee.profilePictureUrl = req.body.profilePictureUrl;
        if(req.body.idProofUrl) employee.idProofUrl = req.body.idProofUrl;
        if(req.body.documents) employee.documents = req.body.documents;

        if (req.body.password) {
            employee.password = req.body.password;
        }
        const updatedEmployee = await employee.save();
        res.json({
            _id: updatedEmployee._id,
            name: updatedEmployee.name,
            email: updatedEmployee.email,
            token: generateToken(updatedEmployee._id, 'employee'),
        });
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
};
// @desc    Mark attendance (check-in/check-out)
exports.markAttendance = async (req, res) => {
    const { type, status, eod, notes, deviceInfo } = req.body;
    const employeeId = req.user.id;
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    try {
        let attendance = await Attendance.findOne({ employeeId, date: today });

        if (type === 'checkin') {
            if (attendance) {
                return res.status(400).json({ message: 'Already checked in today' });
            }

            // --- Create a login record for the check-in action ---
            const ipAddress = req.ip || req.connection.remoteAddress;
            const newCheckInRecord = new LoginRecord({
                employeeId: employeeId,
                action: 'Check-in',
                deviceInfo: deviceInfo || 'Unknown device',
                ipAddress: ipAddress,
                isTouchDevice: req.body.isTouchDevice || false,
            });
            await newCheckInRecord.save();

            // Leave Deduction Logic
            if (status === 'Holiday' || status === 'Half Day') {
                const employee = await Employee.findById(employeeId);
                if (!employee) return res.status(404).json({ message: 'Employee not found' });
                if (status === 'Holiday') employee.holidaysLeft -= 1;
                else if (status === 'Half Day') employee.holidaysLeft -= 0.5;
                await employee.save();
            }

            attendance = new Attendance({
                employeeId, date: today, status, notes,
                checkIn: new Date(),
            });
            await attendance.save();
            
            const populatedAttendance = await Attendance.findById(attendance._id).populate('employeeId');
            res.status(201).json(populatedAttendance);

        } else if (type === 'checkout') {
            if (!attendance) {
                const checkInRecord = await Attendance.findOne({ employeeId, checkOut: null }).sort({ checkIn: -1 });
                if (!checkInRecord) return res.status(400).json({ message: 'You have not checked in' });
                attendance = checkInRecord;
            }
            if (!eod) return res.status(400).json({ message: 'EOD report is required to check out' });
            attendance.checkOut = new Date();
            attendance.eod = eod;
            await attendance.save();
            res.json(attendance);
        } else {
            res.status(400).json({ message: 'Invalid attendance type' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};



// @desc    Get employee's attendance history
exports.getAttendanceHistory = async (req, res) => {
    try {
        // --- FIX: Populate the employeeId field to include name and department ---
        const attendance = await Attendance.find({ employeeId: req.user.id })
            .populate('employeeId', 'name department') // This line is added
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.getAnnouncementsForEmployee = async (req, res) => {
    try {
        const allAnnouncements = await Announcement.find().sort({ createdAt: -1 });
        const employee = await Employee.findById(req.user.id).select('readAnnouncements');

        // Add an 'isRead' flag to each announcement for the frontend
        const announcementsWithStatus = allAnnouncements.map(ann => ({
            ...ann.toObject(),
            isRead: employee.readAnnouncements.includes(ann._id),
        }));

        res.json(announcementsWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Mark announcements as read for the logged-in employee
exports.markAnnouncementsAsRead = async (req, res) => {
    try {
        // Use $addToSet to add the current announcement ID to the readAnnouncements array,
        // preventing duplicates. We'll just mark all as read for simplicity.
        await Employee.findByIdAndUpdate(req.user.id, {
            $set: { readAnnouncements: await Announcement.find().distinct('_id') }
        });
        res.status(200).json({ message: 'All announcements marked as read.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};



exports.applyForLeave = async (req, res) => {
    const { leaveDate, reason } = req.body;
    try {
        const newLeaveRequest = new LeaveRequest({
            employeeId: req.user.id,
            leaveDate,
            reason,
        });
        await newLeaveRequest.save();
        res.status(201).json(newLeaveRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// --- NEW FUNCTION ---
// @desc    Get the leave application history for the logged-in employee
exports.getLeaveHistory = async (req, res) => {
    try {
        const leaveHistory = await LeaveRequest.find({ employeeId: req.user.id })
            .sort({ createdAt: -1 }); // Show the most recent applications first
        res.json(leaveHistory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
