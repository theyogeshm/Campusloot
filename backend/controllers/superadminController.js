// backend/controllers/superadminController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Get all users (with role 'user')
// @route   GET /api/superadmin/users
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' });
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all admins (with role 'admin')
// @route   GET /api/superadmin/admins
const getAdmins = async (req, res, next) => {
    try {
        const admins = await User.find({ role: 'admin' });
        return res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new admin
// @route   POST /api/superadmin/create-admin
const createAdmin = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, password'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        return res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upgrade user to admin
// @route   PATCH /api/superadmin/upgrade/:id
const upgradeUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.role = 'admin';
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User successfully upgraded to Admin',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Downgrade admin to user
// @route   PATCH /api/superadmin/downgrade/:id
const downgradeAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        user.role = 'user';
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Admin successfully downgraded to User',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete admin
// @route   DELETE /api/superadmin/delete/:id
const deleteAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update admin details
// @route   PUT /api/superadmin/update/:id
const updateAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both name and email'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        user.name = name;
        user.email = email;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Admin details updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getAdmins,
    createAdmin,
    upgradeUser,
    downgradeAdmin,
    deleteAdmin,
    updateAdmin
};
