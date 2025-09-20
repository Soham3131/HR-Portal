

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const documentSchema = new mongoose.Schema({
    name: String,
    url: String,
    public_id: String,
});

const EmployeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: [true, 'Please provide a department'],
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    dob: {
        type: Date,
    },
    joiningDate: {
        type: Date,
    },
    salary: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,   // we’ll store "City, Country"
        default: 'Unknown',
    },

    profilePictureUrl: {
        type: String,
        default: '',
    },
    documents: [documentSchema],
    idProofUrl: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    holidaysLeft: {
        type: Number,
        default: 2,
    },
    status: {
        type: String,
        enum: ['Active', 'Deactivated'],
        default: 'Active',
    },
    deactivationDate: {
        type: Date,
    },
    readAnnouncements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement'
    }],
}, { timestamps: true });

// --- THIS IS THE CORRECTED LOGIC ---
EmployeeSchema.pre('save', async function(next) {
    // Generate Employee ID only if it's a new employee and doesn't have one
    if (this.isNew && !this.employeeId) {
        // Find the employee with the numerically highest ID, not the most recently created one.
        const lastEmployee = await this.constructor.findOne({ employeeId: { $regex: /^AVANI-/ } }).sort({ employeeId: -1 });
        
        let newIdNumber = 1001;
        if (lastEmployee && lastEmployee.employeeId) {
            const lastIdNumber = parseInt(lastEmployee.employeeId.split('-')[1]);
            newIdNumber = lastIdNumber + 1;
        }
        this.employeeId = `AVANI-${newIdNumber}`;
    }

    // Hash the password ONLY if it has been modified (or is new).
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

EmployeeSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Add TTL index for automatic deletion of deactivated employees ---
EmployeeSchema.index({ deactivationDate: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
