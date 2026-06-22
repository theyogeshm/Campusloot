const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Locate the user data file dynamically and robustly
let userDataPath = '';
let currentDir = __dirname;

for (let i = 0; i < 5; i++) {
    const potentialJson = path.join(currentDir, 'data', 'user.json');
    const potentialJs = path.join(currentDir, 'data', 'user.js');
    if (fs.existsSync(potentialJson)) {
        userDataPath = potentialJson;
        break;
    } else if (fs.existsSync(potentialJs)) {
        userDataPath = potentialJs;
        break;
    }
    
    // Also try looking in sibling directories
    const siblingJson = path.join(currentDir, '..', 'data', 'user.json');
    const siblingJs = path.join(currentDir, '..', 'data', 'user.js');
    if (fs.existsSync(siblingJson)) {
        userDataPath = siblingJson;
        break;
    } else if (fs.existsSync(siblingJs)) {
        userDataPath = siblingJs;
        break;
    }
    
    currentDir = path.dirname(currentDir);
}

if (!userDataPath) {
    userDataPath = 'C:\\Users\\hp\\OneDrive\\Desktop\\merge\\data\\user.js';
}

let userData = null;
try {
    if (fs.existsSync(userDataPath)) {
        const rawContent = fs.readFileSync(userDataPath, 'utf8');
        userData = JSON.parse(rawContent);
    }
} catch (error) {
    console.error('Failed to parse user data:', error);
}

const schemaFields = {};

if (userData && Array.isArray(userData) && userData.length > 0) {
    userData.forEach(user => {
        Object.keys(user).forEach(key => {
            if (key === '_id' || key === '__v') return;
            
            const val = user[key];
            if (val === undefined || val === null) return;

            if (!schemaFields[key]) {
                if (Array.isArray(val)) {
                    schemaFields[key] = [];
                } else if (typeof val === 'number') {
                    schemaFields[key] = { type: Number };
                } else if (typeof val === 'boolean') {
                    schemaFields[key] = { type: Boolean };
                } else if (typeof val === 'string') {
                    if (!isNaN(Date.parse(val)) && val.includes('-') && val.includes(':')) {
                        schemaFields[key] = { type: Date };
                    } else {
                        schemaFields[key] = { type: String };
                    }
                } else {
                    schemaFields[key] = { type: mongoose.Schema.Types.Mixed };
                }
            }

            if (Array.isArray(val) && val.length > 0) {
                const subSchemaFields = {};
                val.forEach(item => {
                    if (typeof item === 'object' && item !== null) {
                        Object.keys(item).forEach(subKey => {
                            if (!subSchemaFields[subKey]) {
                                const subVal = item[subKey];
                                if (subKey === '_id') {
                                    subSchemaFields[subKey] = { type: mongoose.Schema.Types.ObjectId };
                                } else if (subKey === 'opportunityId') {
                                    subSchemaFields[subKey] = { type: mongoose.Schema.Types.ObjectId };
                                } else if (typeof subVal === 'number') {
                                    subSchemaFields[subKey] = { type: Number };
                                } else if (typeof subVal === 'boolean') {
                                    subSchemaFields[subKey] = { type: Boolean };
                                } else if (typeof subVal === 'string') {
                                    if (/^[0-9a-fA-F]{24}$/.test(subVal)) {
                                        subSchemaFields[subKey] = { type: mongoose.Schema.Types.ObjectId };
                                    } else {
                                        subSchemaFields[subKey] = { type: String };
                                    }
                                } else {
                                    subSchemaFields[subKey] = { type: mongoose.Schema.Types.Mixed };
                                }
                            }
                        });
                    }
                });
                
                if (Object.keys(subSchemaFields).length > 0) {
                    schemaFields[key] = [subSchemaFields];
                } else {
                    schemaFields[key] = [mongoose.Schema.Types.Mixed];
                }
            }
        });
    });
} else {
    // Fallback schema if data/user.js is missing
    schemaFields.name = { type: String };
    schemaFields.email = { type: String, required: true, unique: true };
    schemaFields.role = { type: String };
    schemaFields.college = { type: String };
    schemaFields.year = { type: Number };
    schemaFields.branch = { type: String };
    schemaFields.savedOpportunities = [
        {
            opportunityId: { type: mongoose.Schema.Types.ObjectId },
            onModel: { type: String },
            _id: { type: mongoose.Schema.Types.ObjectId }
        }
    ];
    schemaFields.createdAt = { type: Date };
}

if (schemaFields.email) {
    schemaFields.email = {
        type: String,
        required: true,
        unique: true
    };
}

// Always ensure password is in schema fields for auth support
schemaFields.password = {
    type: String,
    required: false,
    select: false
};

const UserSchema = new mongoose.Schema(schemaFields, {
    timestamps: false,
    versionKey: '__v'
});

module.exports = mongoose.model('User', UserSchema);