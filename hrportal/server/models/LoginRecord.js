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
    }
}, { timestamps: true }); // timestamps adds createdAt and updatedAt automatically

// --- NEW: TTL Index for Automatic Deletion after 7 days ---
// This tells MongoDB to automatically delete documents from this collection
// 7 days (604800 seconds) after their 'createdAt' timestamp.
loginRecordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

const LoginRecord = mongoose.model('LoginRecord', loginRecordSchema);
module.exports = LoginRecord;
