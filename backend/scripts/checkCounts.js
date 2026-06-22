const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Internship = require('../models/Internship');
const Hackathon = require('../models/Hackathon');
const Scholarship = require('../models/Scholarship');
const ExtraActivity = require('../models/ExtraActivity');

const checkCounts = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in backend/.env file');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB. Fetching document counts...');

        const usersCount = await User.countDocuments();
        const internshipsCount = await Internship.countDocuments();
        const hackathonsCount = await Hackathon.countDocuments();
        const scholarshipsCount = await Scholarship.countDocuments();
        const activitiesCount = await ExtraActivity.countDocuments();

        console.log(`\nCOUNTS:`);
        console.log(`- users collection → ${usersCount} documents`);
        console.log(`- internships collection → ${internshipsCount} documents`);
        console.log(`- hackathons collection → ${hackathonsCount} documents`);
        console.log(`- scholarships collection → ${scholarshipsCount} documents`);
        console.log(`- activities collection → ${activitiesCount} documents`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error checking counts:', error);
        process.exit(1);
    }
};

checkCounts();
