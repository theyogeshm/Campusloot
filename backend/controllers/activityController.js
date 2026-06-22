// backend/controllers/activityController.js
const ExtraActivity = require('../models/ExtraActivity');

// @desc    Create a new Extra Activity
// @route   POST /api/activities
// @access  Private/Admin
const createActivity = async (req, res) => {
    try {
        const { title, organizer, type, rewards, mode, applyLink, affiliateLink, deadline } = req.body;

        const activity = await ExtraActivity.create({
            title,
            organizer,
            type,
            rewards,
            mode,
            applyLink,
            affiliateLink,
            deadline,
            postedBy: req.user._id
        });

        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active activities with Search & Filters
// @route   GET /api/activities
// @access  Public
const getActivities = async (req, res) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['search', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        query = ExtraActivity.find({ deadline: { $gte: new Date() }, ...reqQuery });

        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query = query.find({
                $or: [{ title: searchRegex }, { organizer: searchRegex }, { type: searchRegex }]
            });
        }

        query = query.sort('deadline');
        const activities = await query;

        res.status(200).json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Activity (or Expire)
// @route   PUT /api/activities/:id
// @access  Private/Admin
const updateActivity = async (req, res) => {
    try {
        let activity = await ExtraActivity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

        activity = await ExtraActivity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getActivityById = async (req, res) => {
    try {
        const activity = await ExtraActivity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteActivity = async (req, res) => {
    try {
        const activity = await ExtraActivity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

        await activity.deleteOne();
        res.status(200).json({ success: true, message: 'Activity removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createActivity, getActivities, getActivityById, updateActivity, deleteActivity };