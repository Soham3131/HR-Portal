const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const HR = require('../models/HR');

const protect = (userType) => async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Check if the token's user type matches the required type
            if (decoded.role !== userType) {
                return res.status(403).json({ message: 'Not authorized for this role' });
            }

            // Get user from the token
            if (userType === 'employee') {
                req.user = await Employee.findById(decoded.id).select('-password');
            } else if (userType === 'hr') {
                req.user = await HR.findById(decoded.id).select('-password');
            }

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.protectEmployee = protect('employee');
exports.protectHR = protect('hr');
