// backend/middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * SECURITY-HARDENED admin middleware.
 * Validates JWT token, then verifies the user's role === 'admin' OR 'superadmin' against the DATABASE.
 */
const adminAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            // Role must be 'admin' or 'superadmin' in the DATABASE
            if (user.role !== 'admin' && user.role !== 'superadmin') {
                return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
            }

            req.user = user;
            req.admin = decoded;
            return next();

        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

module.exports = adminAuth;
