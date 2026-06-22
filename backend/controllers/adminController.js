// backend/controllers/adminController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Admin login and token generation
// @route   POST /api/admin/login
const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email from MongoDB
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify user has admin privileges
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Administrative privileges required'
            });
        }

        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Sign JWT token with admin role
        const token = jwt.sign(
            { email: user.email, name: user.name, role: user.role, isAdmin: true, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Admin authenticated successfully',
            token,
            email: user.email,
            name: user.name,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    adminLogin
};
