// controllers/employeeController.js
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const generateToken = require('../utils/generateToken');
const Announcement = require('../models/Announcement');
const LoginRecord = require('../models/LoginRecord');
const LeaveRequest = require('../models/LeaveRequest');
const Penalty = require('../models/Penalty');
const geoip = require('geoip-lite');
const axios = require("axios");





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

function parseDeviceModel(userAgent) {
  if (!userAgent) return "Unknown";

  // Android devices → extracts model like "Redmi Note 10"
  const androidMatch = userAgent.match(/\((?:Linux; )?Android.*?; ([^)]+)\)/i);
  if (androidMatch && androidMatch[1]) {
    return androidMatch[1].trim();
  }

  // iPhone / iPad
  if (/iPhone/i.test(userAgent)) return "iPhone";
  if (/iPad/i.test(userAgent)) return "iPad";

  // Windows / Mac
  if (/Windows/i.test(userAgent)) return "Windows PC";
  if (/Macintosh/i.test(userAgent)) return "Mac";

  return "Unknown";
}

// exports.markAttendance = async (req, res) => {
//   const { type, status, eod, notes, deviceInfo, isTouchDevice, latitude, longitude } = req.body;
//   const employeeId = req.user.id;
//   const now = new Date();
//   const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

//   try {
//     let attendance = await Attendance.findOne({ employeeId, date: today });

//     // --- Device + IP ---
//     const ipAddress =
//       req.body.ipAddress ||
//       req.headers["x-forwarded-for"]?.split(",")[0] ||
//       req.ip ||
//       "Unknown";

//     const userAgent = deviceInfo || req.headers["user-agent"] || "Unknown device";
//     const deviceModel = parseDeviceModel(userAgent);

//     // --- Location ---
//     let location = "Unknown";
//     if (latitude && longitude) {
//       location = `Lat: ${latitude}, Lng: ${longitude}`;
//     }

//     if (type === "checkin") {
//       if (attendance) {
//         return res.status(400).json({ message: "Already checked in today" });
//       }

//       await new LoginRecord({
//         employeeId,
//         action: "Check-in",
//         deviceModel,
//         deviceInfo: userAgent,
//         ipAddress,
//         location,
//         latitude,
//         longitude,
//         isTouchDevice: isTouchDevice || false,
//       }).save();

//       if (status === "Holiday" || status === "Half Day") {
//         const employee = await Employee.findById(employeeId);
//         if (!employee) return res.status(404).json({ message: "Employee not found" });

//         if (status === "Holiday") employee.holidaysLeft -= 1;
//         else if (status === "Half Day") employee.holidaysLeft -= 0.5;
//         await employee.save();
//       }

//       attendance = new Attendance({
//         employeeId,
//         date: today,
//         status,
//         notes,
//         checkIn: new Date(),
//       });
//       await attendance.save();

//       const populatedAttendance = await Attendance.findById(attendance._id).populate("employeeId");
//       return res.status(201).json(populatedAttendance);
//     }

//     if (type === "checkout") {
//       if (!attendance) {
//         const checkInRecord = await Attendance.findOne({
//           employeeId,
//           checkOut: null,
//         }).sort({ checkIn: -1 });

//         if (!checkInRecord) {
//           return res.status(400).json({ message: "You have not checked in" });
//         }

//         attendance = checkInRecord;
//       }

//       if (!eod) {
//         return res.status(400).json({ message: "EOD report is required to check out" });
//       }

//       attendance.checkOut = new Date();
//       attendance.eod = eod;
//       await attendance.save();

//       await new LoginRecord({
//         employeeId,
//         action: "Check-out",
//         deviceModel,
//         deviceInfo: userAgent,
//         ipAddress,
//         location,
//         latitude,
//         longitude,
//         isTouchDevice: isTouchDevice || false,
//       }).save();

//       const populatedAttendance = await Attendance.findById(attendance._id).populate("employeeId");
//       return res.json(populatedAttendance);
//     }

//     return res.status(400).json({ message: "Invalid attendance type" });
//   } catch (error) {
//     console.error("MarkAttendance error:", error);
//     return res.status(500).json({ message: "Server Error: " + error.message });
//   }
// };

// ✅ Attendance Controller
exports.markAttendance = async (req, res) => {
  const { type, status, eod, notes, deviceInfo, isTouchDevice, latitude, longitude } = req.body;
  const employeeId = req.user.id;
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  try {
    let attendance = await Attendance.findOne({ employeeId, date: today });

    // --- Device + IP ---
    const ipAddress =
      req.body.ipAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.ip ||
      "Unknown";

    const userAgent = deviceInfo || req.headers["user-agent"] || "Unknown device";
    const deviceModel = parseDeviceModel(userAgent); // 👈 pulls "Redmi Note 10", "Realme GT", etc.

    // --- Location ---
    let location = "Unknown";
    if (latitude && longitude) {
      location = `Lat: ${latitude}, Lng: ${longitude}`;
    }

    // --- CHECK-IN ---
    if (type === "checkin") {
      if (attendance) {
        return res.status(400).json({ message: "Already checked in today" });
      }

      // ✅ Atomic upsert to prevent duplicate check-in race conditions
      attendance = await Attendance.findOneAndUpdate(
        { employeeId, date: today },
        {
          $setOnInsert: {
            employeeId,
            date: today,
            status,
            notes,
            checkIn: new Date(),
          },
        },
        { upsert: true, new: true }
      );

      // Add login record
      await new LoginRecord({
        employeeId,
        action: "Check-in",
        deviceModel,
        deviceInfo: userAgent,
        ipAddress,
        location,
        latitude,
        longitude,
        isTouchDevice: isTouchDevice || false,
      }).save();

      // ✅ Handle holiday / half-day deductions
      if (status === "Holiday" || status === "Half Day") {
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        if (status === "Holiday") employee.holidaysLeft -= 1;
        else if (status === "Half Day") employee.holidaysLeft -= 0.5;

        await employee.save();
      }

      const populatedAttendance = await Attendance.findById(attendance._id).populate("employeeId");
      return res.status(201).json(populatedAttendance);
    }

    // --- CHECK-OUT ---
    if (type === "checkout") {
      if (!attendance) {
        const checkInRecord = await Attendance.findOne({
          employeeId,
          checkOut: null,
        }).sort({ checkIn: -1 });

        if (!checkInRecord) {
          return res.status(400).json({ message: "You have not checked in" });
        }

        attendance = checkInRecord;
      }

      if (!eod) {
        return res.status(400).json({ message: "EOD report is required to check out" });
      }

      attendance.checkOut = new Date();
      attendance.eod = eod;
      await attendance.save();

      await new LoginRecord({
        employeeId,
        action: "Check-out",
        deviceModel,
        deviceInfo: userAgent,
        ipAddress,
        location,
        latitude,
        longitude,
        isTouchDevice: isTouchDevice || false,
      }).save();

      const populatedAttendance = await Attendance.findById(attendance._id).populate("employeeId");
      return res.json(populatedAttendance);
    }

    return res.status(400).json({ message: "Invalid attendance type" });
  } catch (error) {
    console.error("MarkAttendance error:", error);
    return res.status(500).json({ message: "Server Error: " + error.message });
  }
};

exports.getPenalties = async (req, res) => {
    try {
        const { month } = req.query;
        const start = new Date(`${month}-01T00:00:00Z`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const penalties = await LoginRecord.aggregate([
            {
                $match: {
                    action: { $in: ['Check-in', 'Check-out'] },
                    isTouchDevice: true,
                    createdAt: { $gte: start, $lt: end }
                }
            },
            {
                $group: {
                    _id: { employeeId: "$employeeId" },
                    penaltyCount: { $sum: 1 },
                    dates: { $push: { action: "$action", createdAt: "$createdAt", ip: "$ipAddress" } }
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id.employeeId",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            { $unwind: "$employee" },
            {
  $project: {
    employeeId: "$employee.employeeId",
    name: "$employee.name",
    department: "$employee.department",
    penaltyCount: 1,
    dates: { $ifNull: ["$dates", []] } // ✅ Always return [] if null/undefined
  }
}

        ]);

        res.json(penalties);
    } catch (err) {
        res.status(500).json({ message: "Error fetching penalties: " + err.message });
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

exports.getEmployeeRankings = async (req, res) => {
    try {
        // --- FIX 1: Use the month and year from the request query ---
        const { month, year } = req.query;

        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0));

        const employees = await Employee.find({}).select('name employeeId');
        const monthlyAttendance = await Attendance.find({
            date: { $gte: startDate, $lte: endDate }
        });

        const employeeStats = employees.map(emp => {
            const empAttendance = monthlyAttendance.filter(a => a.employeeId.toString() === emp._id.toString());
            
            const totalSignIns = empAttendance.filter(att => att.checkIn).length;
            
            const IST_OFFSET_MS = 330 * 60 * 1000;
            const LATE_THRESHOLD_MINUTES = 555; // 9:15 AM

            const lateSignIns = empAttendance.filter(att => {
                if (!att.checkIn) return false;
                const checkInUTC = new Date(att.checkIn);
                const checkInIST = new Date(checkInUTC.getTime() + IST_OFFSET_MS);
                const checkInMinutes = checkInIST.getUTCHours() * 60 + checkInIST.getUTCMinutes();
                return checkInMinutes > LATE_THRESHOLD_MINUTES;
            }).length;

            const totalPresentDays = empAttendance.filter(r => r.status === 'Present' || r.status === 'Half Day').length;
            const eodSubmissions = empAttendance.filter(r => r.eod).length;

            return {
                _id: emp._id,
                name: emp.name,
                employeeId: emp.employeeId,
                timelySignInPercentage: totalSignIns > 0 ? Math.round(((totalSignIns - lateSignIns) / totalSignIns) * 100) : 0,
                eodSubmissionPercentage: totalPresentDays > 0 ? Math.round((eodSubmissions / totalPresentDays) * 100) : 0,
            };
        });

        // --- FIX 2: Corrected logic for handling ties ---
        const assignRanks = (stats, key) => {
            const sorted = [...stats].sort((a, b) => b[key] - a[key]);
            let rank = 1;
            for (let i = 0; i < sorted.length; i++) {
                // If not the first person and their score is lower than the person before them, update the rank
                if (i > 0 && sorted[i][key] < sorted[i - 1][key]) {
                    rank = i + 1;
                }
                sorted[i][`${key}Rank`] = rank;
            }
            return sorted;
        };
        
        const timelySignInRankings = assignRanks(employeeStats, 'timelySignInPercentage');
        const eodSubmissionRankings = assignRanks(employeeStats, 'eodSubmissionPercentage');

        res.json({ timelySignInRankings, eodSubmissionRankings });

    } catch (error) {
        console.error("Error in getEmployeeRankings:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.getEmployeePenalties = async (req, res) => {
  const { employeeId } = req.params;
  const { month } = req.query; // YYYY-MM
  try {
    const penalties = await Penalty.find({
      employee: employeeId,
      month,
    }).populate("employee", "name employeeId");
    res.json(penalties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

