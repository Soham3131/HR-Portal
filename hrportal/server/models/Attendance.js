// const mongoose = require('mongoose');

// const AttendanceSchema = new mongoose.Schema({
//     employeeId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Employee',
//         required: true,
//     },
//     date: {
//         type: Date,
//         required: true,
//     },
//     status: {
//         type: String,
//         enum: ['Present', 'Half Day', 'Holiday', 'Absent'],
//         required: true,
//     },
//     checkIn: {
//         type: Date,
//     },
//     checkOut: {
//         type: Date,
//     },
//     eod: {
//         type: String,
//     },
//     notes: { // <-- New optional notes field
//         type: String,
//     }
// }, { timestamps: true });

// const Attendance = mongoose.model('Attendance', AttendanceSchema);
// module.exports = Attendance;

const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Half Day', 'Holiday', 'Absent'],
        required: true,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    eod: {
        type: String,
    },
    notes: { 
        type: String,
    }
}, { timestamps: true });

// ✅ Prevent duplicate attendance for same employee on same date
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;

