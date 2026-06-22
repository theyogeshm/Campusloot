const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true }, // Government, Corporate, Trust
    amount: { type: String, required: true }, // e.g., "₹50,000 per year"
    category: { 
        type: String, 
        required: true 
    },
    eligibility: {
        incomeLimit: { type: String, default: "No Bar" }, // e.g., "< 8 LPA"
        courseAllowed: [String], // ['B.Tech', 'B.Sc', 'All']
        minMarks: { type: String, default: "N/A" } // e.g., "60% in 12th"
    },
    applyLink: { type: String, required: true },
    affiliateLink: { type: String, default: "" }, //primary earning revenue source link!
    deadline: { type: Date, required: true },
    isExpired: { type: Boolean, default: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clicks: {
        type: Number,
        default: 0,
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scholarship', ScholarshipSchema);