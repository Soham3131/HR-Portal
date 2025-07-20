// // models/Employee.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const documentSchema = new mongoose.Schema({
//     name: String,
//     url: String,
//     public_id: String,
// });

// const EmployeeSchema = new mongoose.Schema({
//     employeeId: {
//         type: String,
//         unique: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     department: {
//         type: String,
//         required: [true, 'Please provide a department'],
//     },
//     phone: {
//         type: String,
//     },
//     address: {
//         type: String,
//     },
//     dob: {
//         type: Date,
//     },
//     joiningDate: { // New Field
//         type: Date,
//     },
//     salary: { // New Field
//         type: Number,
//         default: 0,
//     },
//     profilePictureUrl: { // New Field
//         type: String,
//         default: '',
//     },
//     documents: [documentSchema], // New Field for marksheets
//     idProofUrl: { // New Field
//         type: String,
//         default: '',
//     },
//     holidaysLeft: {
//         type: Number,
//         default: 2,
//     },
// }, { timestamps: true });

// // Pre-save hook for hashing password and generating employee ID
// EmployeeSchema.pre('save', async function(next) {
//     if (this.isNew && !this.employeeId) {
//         const lastEmployee = await this.constructor.findOne({}, {}, { sort: { 'createdAt' : -1 } });
//         let newIdNumber = 1001;
//         if (lastEmployee && lastEmployee.employeeId) {
//             const lastIdNumber = parseInt(lastEmployee.employeeId.split('-')[1]);
//             newIdNumber = lastIdNumber + 1;
//         }
//         this.employeeId = `AVANI-${newIdNumber}`;
//     }

//     if (!this.isModified('password')) {
//         return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// EmployeeSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// const Employee = mongoose.model('Employee', EmployeeSchema);
// module.exports = Employee;

// models/Employee.js
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
    readAnnouncements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement'
    }],
}, { timestamps: true });

// This pre-save hook now ONLY handles the password and employee ID
EmployeeSchema.pre('save', async function(next) {
    // Generate Employee ID only if it's a new employee
    if (this.isNew && !this.employeeId) {
        const lastEmployee = await this.constructor.findOne({}, {}, { sort: { 'createdAt' : -1 } });
        let newIdNumber = 1001;
        if (lastEmployee && lastEmployee.employeeId) {
            const lastIdNumber = parseInt(lastEmployee.employeeId.split('-')[1]);
            newIdNumber = lastIdNumber + 1;
        }
        this.employeeId = `AVANI-${newIdNumber}`;
    }

    // Hash the password ONLY if it has been modified (or is new).
    // This will no longer affect the OTP.
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

const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
