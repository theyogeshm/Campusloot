// backend/controllers/hackathonController.js
const Hackathon = require('../models/Hackathon');

// @desc    Create a new Hackathon listing
// @route   POST /api/hackathons
// @access  Private/Admin
const createHackathon = async (req, res) => {
    try {
        const { title, organizer, prizePool, teamSize, mode, platform, applyLink, affiliateLink, deadline, eventDate } = req.body;

        const hackathon = await Hackathon.create({
            title,
            organizer,
            prizePool,
            teamSize,
            mode,
            platform,
            applyLink,
            affiliateLink,
            deadline,
            eventDate,
            postedBy: req.user._id // Logged-in admin id
        });

        res.status(201).json({ success: true, data: hackathon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active Hackathons with Filters & Search
// @route   GET /api/hackathons
// @access  Public
const getHackathons = async (req, res) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // Exclude pagination and specific text search keys
        const removeFields = ['search', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Default query setup: Sirf un-expired listings (Date based)
        query = Hackathon.find({ deadline: { $gte: new Date() }, ...reqQuery });

        // Global Text Search (Title, Organizer or Platform filter)
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query = query.find({
                $or: [
                    { title: searchRegex },
                    { organizer: searchRegex },
                    { platform: searchRegex }
                ]
            });
        }

        // Sort: Jiske deadline sabse paas hai (Deadline Countdown optimization ke liye)
        query = query.sort('deadline');

        const hackathons = await query;

        res.status(200).json({
            success: true,
            count: hackathons.length,
            data: hackathons
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Hackathon Listing (or Expire)
// @route   PUT /api/hackathons/:id
// @access  Private/Admin
const updateHackathon = async (req, res) => {
    try {
        let hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({ success: false, message: 'Hackathon listing not found' });
        }

        hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: hackathon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a Hackathon Listing
// @route   DELETE /api/hackathons/:id
// @access  Private/Admin
const deleteHackathon = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({ success: false, message: 'Hackathon listing not found' });
        }

        await hackathon.deleteOne();

        res.status(200).json({ success: true, message: 'Hackathon listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getHackathonById = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ success: false, message: 'Hackathon listing not found' });
        }
        res.status(200).json({ success: true, data: hackathon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Export controllers
module.exports = {
    createHackathon,
    getHackathons,
    getHackathonById,
    updateHackathon,
    deleteHackathon
};