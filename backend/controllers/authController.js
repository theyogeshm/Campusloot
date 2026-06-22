// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Token generate karne ka helper function - includes id, email, name, role, isAdmin
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            name: user.name, 
            role: user.role, 
            isAdmin: user.role === 'admin' || user.role === 'superadmin' 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );
};

// @desc    Register a new student
// @route   POST /api/auth/signup  OR  POST /api/auth/register
// SECURITY: role and isAdmin fields from request body are INTENTIONALLY IGNORED.
//           All new users receive role:'user'. Admin role must be set manually in DB.
const registerUser = async (req, res) => {
    try {
        // SECURITY: Do NOT destructure 'role' or 'isAdmin' from req.body
        // Any role value sent by the client is silently discarded.
        const { name, email, password, college, year, branch } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user — role is ALWAYS 'user', never taken from request body
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            college,
            year,
            branch,
            role: 'user' // HARDCODED: Admins cannot be created via public registration
        });

        if (user) {
            const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user),
                isSuperAdmin: user.email === SUPER_ADMIN_EMAIL
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => { // 'next' parameter add kiya
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(401); // Middleware status pick kar lega
            throw new Error('Invalid email or password');
        }

        if (!user.password) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid email or password');
        }
        
        const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            college: user.college,
            token: generateToken(user),
            isSuperAdmin: user.email === SUPER_ADMIN_EMAIL
        });
    } catch (error) {
        next(error); // Manual res.json ki jagah error ko central middleware pe bhej diya
    }
};

module.exports = { registerUser, loginUser };