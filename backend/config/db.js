// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Atlas Connected: ${conn.connection.host} ⚡`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message} ❌`);
        process.exit(1); // Failure par process exit kar do (1 ka matlab exit with failure)
    }
};

module.exports = connectDB;