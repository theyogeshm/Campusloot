const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const setSuperAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in backend/.env file');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const email = process.env.SUPER_ADMIN_EMAIL || 'knowledgespace457@gmail.com';

        // 1. Demote old superadmins whose email is not the current SUPER_ADMIN_EMAIL
        const demoted = await User.updateMany(
            { email: { $ne: email }, role: 'superadmin' },
            { role: 'user' }
        );
        if (demoted.modifiedCount > 0) {
            console.log(`Demoted ${demoted.modifiedCount} old superadmin(s).`);
        }

        // 2. Find or create the new superadmin
        let user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found. Creating a new superadmin user...`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('campusloot_admin_pwd_2026', salt);

            user = await User.create({
                name: 'Super Admin',
                email: email,
                password: hashedPassword,
                role: 'superadmin',
                college: 'Elite Institute',
                year: 4,
                branch: 'Computer Science'
            });
            console.log('Created user successfully:', user);
        } else {
            console.log('User found:', user);
            user.role = 'superadmin';
            await user.save();
            console.log('Updated user role to superadmin.');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error setting superadmin:', error);
        process.exit(1);
    }
};

setSuperAdmin();
