const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const audit = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const schemaPaths = Object.keys(User.schema.paths);
        console.log('User Schema Paths:', schemaPaths);

        const roles = await User.distinct('role');
        console.log('Unique Roles in DB:', roles);

        const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } });
        console.log('Admins/Superadmins in DB:', admins.map(u => ({
            id: u._id,
            email: u.email,
            role: u.role,
            isSuperAdmin: u.isSuperAdmin
        })));

        // Let's also check if any user has a truthy isSuperAdmin field
        const superAdminsByField = await User.find({ isSuperAdmin: true });
        console.log('Users with isSuperAdmin: true:', superAdminsByField.map(u => ({
            id: u._id,
            email: u.email,
            role: u.role
        })));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

audit();
