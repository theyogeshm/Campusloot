// backend/controllers/scholarshipController.js
const Scholarship = require('../models/Scholarship');

// @desc    Create a new Scholarship listing
// @route   POST /api/scholarships
// @access  Private/Admin
const createScholarship = async (req, res) => {
    try {
        const { title, provider, amount, category, eligibility, applyLink, affiliateLink, deadline } = req.body;

        const scholarship = await Scholarship.create({
            title,
            provider,
            amount,
            category,
            eligibility,
            applyLink,
            affiliateLink: affiliateLink || "", // Waise hi blank chhod sakte hain jaise discuss hua tha 🤝
            deadline,
            postedBy: req.user._id // Logged-in admin id
        });

        res.status(201).json({ success: true, data: scholarship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active Scholarships with Advanced Filters
// @route   GET /api/scholarships
// @access  Public
const getScholarships = async (req, res) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // Exclude general operational fields from query matching
        const removeFields = ['search', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Default Filter: Sirf un-expired listings (Date based)
        query = Scholarship.find({ deadline: { $gte: new Date() }, ...reqQuery });

        // Global Text Search (Title, Provider or Eligibility course keyword)
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query = query.find({
                $or: [
                    { title: searchRegex },
                    { provider: searchRegex },
                    { "eligibility.courseAllowed": searchRegex }
                ]
            });
        }

        // Sort by closest deadline first (Countdown Alert architecture)
        query = query.sort('deadline');

        const scholarships = await query;

        res.status(200).json({
            success: true,
            count: scholarships.length,
            data: scholarships
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update or Mark Scholarship as Expired
// @route   PUT /api/scholarships/:id
// @access  Private/Admin
const updateScholarship = async (req, res) => {
    try {
        let scholarship = await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({ success: false, message: 'Scholarship listing not found' });
        }

        scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: scholarship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a Scholarship Listing
// @route   DELETE /api/scholarships/:id
// @access  Private/Admin
const deleteScholarship = async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({ success: false, message: 'Scholarship listing not found' });
        }

        await scholarship.deleteOne();

        res.status(200).json({ success: true, message: 'Scholarship removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getScholarshipById = async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);
        if (!scholarship) {
            return res.status(404).json({ success: false, message: 'Scholarship listing not found' });
        }
        res.status(200).json({ success: true, data: scholarship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createScholarship,
    getScholarships,
    getScholarshipById,
    updateScholarship,
    deleteScholarship
};