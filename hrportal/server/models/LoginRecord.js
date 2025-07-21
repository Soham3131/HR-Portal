// models/LoginRecord.js
const mongoose = require('mongoose');

const loginRecordSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    action: {
        type: String,
        enum: ['Login', 'Check-in'],
        required: true,
    },
    deviceInfo: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
    },
    // --- NEW FIELD ---
    // This will be true if the browser reports touch capabilities.
    isTouchDevice: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

loginRecordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7-day expiry

const LoginRecord = mongoose.model('LoginRecord', loginRecordSchema);
module.exports = LoginRecord;
