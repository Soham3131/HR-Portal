const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const SalaryRecord = require('../models/SalaryRecord'); 
const SystemConfig = require('../models/SystemConfig');
const Announcement = require('../models/Announcement');
const LoginRecord = require('../models/LoginRecord'); 
const LeaveRequest = require('../models/LeaveRequest'); 

exports.getAllEmployees = async (req, res) => {
    try {
        await checkAndResetLeaves();
        const employees = await Employee.find({}).select('-password');
        res.json(employees);
    } catch (error) {
        console.error("Error in getAllEmployees:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
// @desc    Get a single employee's data by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).select('-password');
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.updateEmployeeByHR = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            employee.name = req.body.name || employee.name;
            employee.email = req.body.email || employee.email;
            employee.phone = req.body.phone || employee.phone;
            employee.address = req.body.address || employee.address;
            employee.department = req.body.department || employee.department;
            employee.dob = req.body.dob || employee.dob;
            employee.holidaysLeft = req.body.holidaysLeft ?? employee.holidaysLeft;
            // New fields for HR to set
            employee.salary = req.body.salary || employee.salary;
            employee.joiningDate = req.body.joiningDate || employee.joiningDate;

            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Delete an employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            await employee.deleteOne();
            // Also remove their attendance records
            await Attendance.deleteMany({ employeeId: req.params.id });
            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get attendance records for all employees
exports.getAttendanceForAll = async (req, res) => {
    try {
        // --- FIX: Populate all necessary fields for the HR view ---
        const attendance = await Attendance.find({})
            .populate('employeeId', 'name department employeeId') // <-- This now includes department and employeeId
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Update an attendance record


exports.updateAttendanceByHR = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        const employee = await Employee.findById(attendance.employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Associated employee not found' });
        }

        const oldStatus = attendance.status;
        const newStatus = req.body.status;

        // Leave deduction logic
        if (oldStatus !== newStatus) {
            let leaveReverted = 0;
            if (oldStatus === 'Holiday') leaveReverted = 1;
            if (oldStatus === 'Half Day') leaveReverted = 0.5;
            
            let newLeaveCost = 0;
            if (newStatus === 'Holiday') newLeaveCost = 1;
            if (newStatus === 'Half Day') newLeaveCost = 0.5;

            employee.holidaysLeft = employee.holidaysLeft + leaveReverted - newLeaveCost;
            await employee.save();
        }

        // Update the attendance record
        attendance.status = newStatus || attendance.status;
        // Allow setting notes to an empty string by checking if the property exists
        if (req.body.hasOwnProperty('notes')) {
            attendance.notes = req.body.notes;
        }

        // --- FINAL TIMEZONE FIX ---
        // This is the most robust way to handle the date strings from the frontend.
        // It accepts valid ISO strings and handles null/empty values gracefully.
        if (req.body.hasOwnProperty('checkIn')) {
            attendance.checkIn = req.body.checkIn ? new Date(req.body.checkIn) : null;
        }
        if (req.body.hasOwnProperty('checkOut')) {
            attendance.checkOut = req.body.checkOut ? new Date(req.body.checkOut) : null;
        }
        // --- END OF FIX ---

        const updatedAttendance = await attendance.save();
        res.json(updatedAttendance);

    } catch (error) {
        console.error("Error updating attendance:", error); // Added for better server-side logging
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.getEodReports = async (req, res) => {
    const { date } = req.query; // Expects a date string like 'YYYY-MM-DD'

    // Determine the target date for checking non-submissions
    let targetDate;
    if (date) {
        // Create a date object from the query string in UTC to avoid timezone issues
        const [year, month, day] = date.split('-').map(Number);
        targetDate = new Date(Date.UTC(year, month - 1, day));
    } else {
        // Default to today (UTC) if no date is provided
        const now = new Date();
        targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    }

    try {
        // Fetch all EOD reports that have been submitted, regardless of date
        const reports = await Attendance.find({ eod: { $exists: true, $ne: null, $ne: "" } })
            .populate('employeeId', 'name department employeeId')
            .sort({ date: -1 });
        
        // Find attendance records for employees who were present on the target date
        const presentRecordsOnTargetDate = await Attendance.find({ 
            date: targetDate, 
            status: { $in: ['Present', 'Half Day'] } 
        });

        // Create a set of IDs for employees who submitted an EOD on the target date
        const submittedEodIds = new Set(presentRecordsOnTargetDate.filter(p => p.eod).map(p => p.employeeId.toString()));
        
        // Create a set of IDs for all employees who were present on the target date
        const presentEmployeeIds = new Set(presentRecordsOnTargetDate.map(p => p.employeeId.toString()));

        // Find employees who were present but did not submit an EOD
        const allEmployees = await Employee.find({});
        const notSubmittedList = allEmployees.filter(emp => 
            presentEmployeeIds.has(emp._id.toString()) && !submittedEodIds.has(emp._id.toString())
        );

        res.json({ reports, notSubmittedList });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.saveSalaryRecord = async (req, res) => {
    const { month, year, notes, payrollData } = req.body;
    try {
        const newRecord = new SalaryRecord({ month, year, notes, payrollData });
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        console.error("Error saving salary record:", error); // Added for better logging
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get all saved salary records
exports.getSalaryRecords = async (req, res) => {
    try {
        const records = await SalaryRecord.find().sort({ year: -1, month: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.updateSalaryRecord = async (req, res) => {
    const { notes } = req.body;
    try {
        const record = await SalaryRecord.findById(req.params.id);
        if (record) {
            record.notes = notes;
            const updatedRecord = await record.save();
            res.json(updatedRecord);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
exports.resetAllLeaves = async (req, res) => {
    try {
        // This powerful command finds all documents ({}) and sets the holidaysLeft field to 2.
        await Employee.updateMany({}, { $set: { holidaysLeft: 2 } });
        res.status(200).json({ message: 'Leave balances for all employees have been reset to 2.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

const checkAndResetLeaves = async () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    let config = await SystemConfig.findOne({ configKey: 'main' });

    // --- FIX: This now correctly uses 'new SystemConfig' ---
    // It will create the record only if it doesn't exist.
    if (!config) {
        console.log("No system config found. Creating a new one.");
        config = new SystemConfig({
            configKey: 'main',
            lastLeaveReset: { month: 0, year: 0 } // Initialize with a past date
        });
        await config.save();
        console.log("New system config created and saved.");
    }

    const { month: lastMonth, year: lastYear } = config.lastLeaveReset;

    // Check if the current date is in a month after the last reset
    if (currentYear > lastYear || (currentYear === lastYear && currentMonth > lastMonth)) {
        console.log(`New month detected. Resetting leave balances for ${currentMonth}/${currentYear}...`);
        
        await Employee.updateMany({}, { $set: { holidaysLeft: 2 } });

        config.lastLeaveReset = { month: currentMonth, year: currentYear };
        await config.save();
        
        console.log("Leave balances have been successfully reset.");
    }
};

exports.createAnnouncement = async (req, res) => {
    const { title, content } = req.body;
    try {
        const announcement = new Announcement({
            title,
            content,
            createdBy: req.user.id, // The logged-in HR user
        });
        await announcement.save();
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get all announcements (for HR view)
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.getAnalyticsData = async (req, res) => {
    try {
        const employees = await Employee.find({});
        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));

        const monthlyAttendance = await Attendance.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // 1. Calculate Attendance Trends
        const attendanceTrends = [];
        for (let i = 1; i <= now.getDate(); i++) {
            const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), i));
            const dayString = day.toISOString().split('T')[0];
            
            const recordsForDay = monthlyAttendance.filter(a => a.date.toISOString().startsWith(dayString));
            
            attendanceTrends.push({
                name: `${day.toLocaleString('default', { month: 'short' })} ${i}`,
                Present: recordsForDay.filter(r => r.status === 'Present').length,
                'Half Day': recordsForDay.filter(r => r.status === 'Half Day').length,
                Holiday: recordsForDay.filter(r => r.status === 'Holiday').length,
            });
        }

        // 2. Calculate Average Sign-in Time
        let totalMinutes = 0;
        let checkInCount = 0;
        const baseTime = 9 * 60; // 9:00 AM in minutes

        monthlyAttendance.forEach(att => {
            if (att.checkIn) {
                const checkInTime = new Date(att.checkIn);
                let checkInMinutes = checkInTime.getUTCHours() * 60 + checkInTime.getUTCMinutes();
                // If login is before 9 AM, count it as 9 AM
                if (checkInMinutes < baseTime) {
                    checkInMinutes = baseTime;
                }
                totalMinutes += checkInMinutes;
                checkInCount++;
            }
        });

        let averageSignInTime = "N/A";
        if (checkInCount > 0) {
            const avgMinutes = totalMinutes / checkInCount;
            const hours = Math.floor(avgMinutes / 60);
            const minutes = Math.round(avgMinutes % 60);
            averageSignInTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        // 3. Calculate Total Paid Leaves Left
        const totalLeavesLeft = employees.reduce((acc, emp) => acc + (emp.holidaysLeft > 0 ? emp.holidaysLeft : 0), 0);

        res.json({
            attendanceTrends,
            averageSignInTime,
            totalLeavesLeft,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.getAnalyticsData = async (req, res) => {
    // This function can be kept for general stats or expanded later.
    // For now, the main logic will be in the new function.
    res.json({ message: "General analytics endpoint." });
};

exports.getEmployeeAnalytics = async (req, res) => {
    const { employeeId } = req.params;
    const { month, year } = req.query; // e.g., month=7, year=2025

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const monthlyAttendance = await Attendance.find({
            employeeId: employeeId,
            date: { $gte: startDate, $lte: endDate }
        });

        let totalMinutes = 0;
        let checkInCount = 0;
        let lateSignIns = 0;
        const baseTime = 9 * 60; // 9:00 AM in minutes

        const signInTrend = [];

        monthlyAttendance.forEach(att => {
            if (att.checkIn) {
                const checkInTime = new Date(att.checkIn);
                const checkInMinutes = checkInTime.getUTCHours() * 60 + checkInTime.getUTCMinutes();
                
                totalMinutes += checkInMinutes;
                checkInCount++;

                if (checkInMinutes > baseTime) {
                    lateSignIns++;
                }

                signInTrend.push({
                    day: new Date(att.date).getUTCDate(),
                    signInTime: parseFloat((checkInMinutes / 60).toFixed(2)) // Time in hours (e.g., 9.5 for 9:30)
                });
            }
        });

        let averageSignInTime = "N/A";
        if (checkInCount > 0) {
            const avgMinutes = totalMinutes / checkInCount;
            const hours = Math.floor(avgMinutes / 60);
            const minutes = Math.round(avgMinutes % 60);
            averageSignInTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        const unpaidLeaves = employee.holidaysLeft < 0 ? Math.abs(employee.holidaysLeft) : 0;

        res.json({
            averageSignInTime,
            lateSignIns,
            unpaidLeaves,
            signInTrend,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};




exports.getConsolidatedAnalytics = async (req, res) => {
    const { month, year } = req.query;
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    const daysInMonth = endDate.getUTCDate();

    try {
        const employees = await Employee.find({});
        const monthlyAttendance = await Attendance.find({
            date: { $gte: startDate, $lte: endDate }
        }).populate('employeeId');

        const IST_OFFSET_MS = 330 * 60 * 1000;
        const LATE_THRESHOLD_MINUTES = 555; // 9:31 AM

        const totalLateSignIns = monthlyAttendance.filter(att => {
            if (!att.checkIn) return false;
            const checkInIST = new Date(new Date(att.checkIn).getTime() + IST_OFFSET_MS);
            const checkInMinutes = checkInIST.getUTCHours() * 60 + checkInIST.getUTCMinutes();
            return checkInMinutes > LATE_THRESHOLD_MINUTES;
        }).length;

        const totalUnpaidLeaves = employees.reduce((acc, emp) => acc + (emp.holidaysLeft < 0 ? Math.abs(emp.holidaysLeft) : 0), 0);

        const dailyTrends = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dayString = new Date(Date.UTC(year, month - 1, i)).toISOString().split('T')[0];
            const recordsForDay = monthlyAttendance.filter(a => a.date.toISOString().startsWith(dayString));
            
            const totalSignIns = recordsForDay.filter(r => r.checkIn).length;
            const timelySignIns = recordsForDay.filter(r => {
                if (!r.checkIn) return false;
                const checkInIST = new Date(new Date(r.checkIn).getTime() + IST_OFFSET_MS);
                const checkInMinutes = checkInIST.getUTCHours() * 60 + checkInIST.getUTCMinutes();
                return checkInMinutes <= LATE_THRESHOLD_MINUTES;
            }).length;

            const totalPresent = recordsForDay.filter(r => r.status === 'Present' || r.status === 'Half Day').length;
            const eodSubmissions = recordsForDay.filter(r => r.eod).length;

            dailyTrends.push({
                name: `${i}`,
                timelySignInPercentage: totalSignIns > 0 ? Math.round((timelySignIns / totalSignIns) * 100) : 0,
                eodSubmissionPercentage: totalPresent > 0 ? Math.round((eodSubmissions / totalPresent) * 100) : 0,
            });
        }

        const consolidatedData = employees.map(emp => {
            const empAttendance = monthlyAttendance.filter(att => att.employeeId && att.employeeId._id.toString() === emp._id.toString());
            
            const lateSignInsList = empAttendance.filter(att => {
                if (!att.checkIn) return false;
                const checkInIST = new Date(new Date(att.checkIn).getTime() + IST_OFFSET_MS);
                const checkInMinutes = checkInIST.getUTCHours() * 60 + checkInIST.getUTCMinutes();
                return checkInMinutes > LATE_THRESHOLD_MINUTES;
            });
            const lateSignIns = lateSignInsList.length;
            const totalSignIns = empAttendance.filter(att => att.checkIn).length;

            const totalPresentDays = empAttendance.filter(r => r.status === 'Present' || r.status === 'Half Day').length;
            const eodSubmissions = empAttendance.filter(r => r.eod).length;

            return {
                id: emp.employeeId,
                name: emp.name,
                department: emp.department,
                unpaidLeaves: emp.holidaysLeft < 0 ? Math.abs(emp.holidaysLeft) : 0,
                lateSignIns,
                lateSignInPercentage: totalSignIns > 0 ? `${Math.round((lateSignIns / totalSignIns) * 100)}%` : 'N/A',
                eodCompliance: totalPresentDays > 0 ? `${Math.round((eodSubmissions / totalPresentDays) * 100)}%` : 'N/A',
            };
        });

        res.json({
            totalLateSignIns,
            totalUnpaidLeaves,
            dailyTrends,
            consolidatedData
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.getLoginData = async (req, res) => {
    try {
        const loginRecords = await LoginRecord.find()
            .populate('employeeId', 'name employeeId department')
            .sort({ createdAt: -1 });
        res.json(loginRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.getPendingLeaves = async (req, res) => {
    try {
        const pendingLeaves = await LeaveRequest.find({ status: 'Pending' })
            .populate('employeeId', 'name department employeeId')
            .sort({ createdAt: 1 });
        res.json(pendingLeaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.getPendingLeaves = async (req, res) => {
    try {
        const pendingLeaves = await LeaveRequest.find({ status: 'Pending' })
            .populate('employeeId', 'name department employeeId')
            .sort({ createdAt: 1 });
        res.json(pendingLeaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Update the status of a leave request
exports.updateLeaveStatus = async (req, res) => {
    const { status } = req.body; // Expecting 'Approved' or 'Declined'
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        leaveRequest.status = status;
        leaveRequest.reviewedBy = req.user.id;
        await leaveRequest.save();
        
        if (status === 'Approved') {
            const employee = await Employee.findById(leaveRequest.employeeId);
            
            employee.holidaysLeft -= 1;
            await employee.save();

            await Attendance.findOneAndUpdate(
                { employeeId: leaveRequest.employeeId, date: leaveRequest.leaveDate },
                { status: 'Holiday', notes: `Leave approved by HR. Reason: ${leaveRequest.reason}` },
                { upsert: true, new: true }
            );
        }

        res.json(leaveRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
