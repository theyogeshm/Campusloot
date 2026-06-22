const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Hackathon = require('../models/Hackathon');
const Internship = require('../models/Internship');
const Scholarship = require('../models/Scholarship');
const ExtraActivity = require('../models/ExtraActivity');

// Helper to convert string fields to proper MongoDB types without changing values
const cleanDoc = (doc) => {
    const newDoc = { ...doc };
    if (newDoc._id && typeof newDoc._id === 'string') {
        newDoc._id = new mongoose.Types.ObjectId(newDoc._id);
    }
    if (newDoc.postedBy && typeof newDoc.postedBy === 'string') {
        newDoc.postedBy = new mongoose.Types.ObjectId(newDoc.postedBy);
    }
    if (newDoc.deadline && typeof newDoc.deadline === 'string') {
        newDoc.deadline = new Date(newDoc.deadline);
    }
    if (newDoc.eventDate && typeof newDoc.eventDate === 'string') {
        newDoc.eventDate = new Date(newDoc.eventDate);
    }
    if (newDoc.createdAt && typeof newDoc.createdAt === 'string') {
        newDoc.createdAt = new Date(newDoc.createdAt);
    }
    return newDoc;
};

const reseed = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in backend/.env file');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully! ⚡\n');

        const tasks = [
            {
                name: 'Hackathons',
                model: Hackathon,
                filePath: path.join(__dirname, '..', '..', '..', 'data', 'hackathons.json'),
                dataKey: 'hackathons'
            },
            {
                name: 'Internships',
                model: Internship,
                filePath: path.join(__dirname, '..', '..', '..', 'data', 'internship.json'),
                dataKey: 'internships'
            },
            {
                name: 'Scholarships',
                model: Scholarship,
                filePath: path.join(__dirname, '..', '..', '..', 'data', 'scholarship.json'),
                dataKey: 'scholarships'
            },
            {
                name: 'Extra Activities',
                model: ExtraActivity,
                filePath: path.join(__dirname, '..', '..', '..', 'data', 'extraActivities.json'),
                dataKey: 'extraActivities'
            }
        ];

        for (const task of tasks) {
            console.log(`--------------------------------------------------`);
            console.log(`Processing: ${task.name}`);
            
            // Read JSON file
            if (!fs.existsSync(task.filePath)) {
                console.error(`File not found: ${task.filePath}`);
                continue;
            }
            
            const rawData = JSON.parse(fs.readFileSync(task.filePath, 'utf8'));
            const items = rawData[task.dataKey] || [];
            
            if (items.length === 0) {
                console.log(`No records found in JSON file for key: ${task.dataKey}`);
                continue;
            }

            console.log(`Found ${items.length} records in JSON. Cleaning and casting types...`);
            const cleanedItems = items.map(cleanDoc);

            // Get raw collection to bypass Mongoose validation and preserve original schema structure
            const collection = mongoose.connection.db.collection(task.model.collection.name);
            
            console.log(`Inserting into MongoDB collection: ${task.model.collection.name}...`);
            try {
                const result = await collection.insertMany(cleanedItems, { ordered: false });
                console.log(`✅ Inserted ${result.insertedCount} records successfully.`);
            } catch (insertError) {
                if (insertError.code === 11000 || insertError.writeErrors) {
                    const inserted = insertError.result ? insertError.result.nInserted : 0;
                    console.log(`⚠️ Some duplicate records were encountered. Inserted: ${inserted} new records.`);
                } else {
                    console.error(`❌ Insert error:`, insertError);
                }
            }

            // Verify count
            const count = await task.model.countDocuments();
            console.log(`📊 Collection Count: ${count} documents`);

            // Fetch and log first document
            const firstDoc = await task.model.findOne();
            if (firstDoc) {
                console.log(`🔍 First document verification:\n`, JSON.stringify(firstDoc, null, 2));
            } else {
                console.log(`🔍 No documents found in collection.`);
            }
            console.log('\n');
        }

        console.log('Reseeding complete! Closing connection...');
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Fatal error during reseeding:', error);
        process.exit(1);
    }
};

reseed();
