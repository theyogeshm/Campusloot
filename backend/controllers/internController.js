// backend/controllers/internController.js
const Internship = require('../models/Internship');

// @desc    Create a new Internship listing
// @route   POST /api/internships
// @access  Private/Admin
const createInternship = async (req, res) => {
    try {
        const { title, company, domain, stipend, locationType, duration, applyLink, affiliateLink, deadline } = req.body;

        const internship = await Internship.create({
            title,
            company,
            domain,
            stipend,
            locationType,
            duration,
            applyLink,
            affiliateLink,
            deadline,
            postedBy: req.user._id // Middleware se mila logged-in admin ka ID
        });

        res.status(201).json({ success: true, data: internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active Internships with Search & Filters
// @route   GET /api/internships
// @access  Public
const getInternships = async (req, res) => {
    try {
        let query;
        
        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude from direct matching (Advanced filters ke liye)
        const removeFields = ['search', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Default Filter: Expired listing bypass karna (Date based)
        query = Internship.find({ deadline: { $gte: new Date() }, ...reqQuery });

        // Text Search Optimization (Title ya Company par search)
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i'); // 'i' for case-insensitive
            query = query.find({
                $or: [
                    { title: searchRegex },
                    { company: searchRegex },
                    { domain: searchRegex }
                ]
            });
        }

        // Sort by newest first
        query = query.sort('-createdAt');

        // Execute query
        const internships = await query;

        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update or Mark Internship as Expired
// @route   PUT /api/internships/:id
// @access  Private/Admin
const updateInternship = async (req, res) => {
    try {
        let internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship listing not found' });
        }

        internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an Internship listing
// @route   DELETE /api/internships/:id
// @access  Private/Admin
const deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship listing not found' });
        }

        await internship.deleteOne();

        res.status(200).json({ success: true, message: 'Listing removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship listing not found' });
        }
        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createInternship,
    getInternships,
    getInternshipById,
    updateInternship,
    deleteInternship
};