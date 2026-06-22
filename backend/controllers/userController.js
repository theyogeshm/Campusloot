const User = require('../models/User');

// @desc    Bookmark/Save or Unbookmark an opportunity
// @route   POST /api/users/bookmark
// @access  Private/Student
const toggleBookmark = async (req, res) => {
    try {
        const { opportunityId, onModel } = req.body;
        const userId = req.user._id; // Logged in user from token

        // Validation for exact models
        if (!['Internship', 'Hackathon', 'Scholarship', 'ExtraActivity'].includes(onModel)) {
            return res.status(400).json({ success: false, message: 'Invalid opportunity type' });
        }

        const user = await User.findById(userId);

        // Check karein ki kya yeh opportunity pehle se saved hai?
        const alreadySavedIndex = user.savedOpportunities.findIndex(
            item => item.opportunityId.toString() === opportunityId && item.onModel === onModel
        );

        if (alreadySavedIndex > -1) {
            // Agar pehle se saved hai, toh 'Unbookmark' kar do (Remove from array)
            user.savedOpportunities.splice(alreadySavedIndex, 1);
            await user.save();
            return res.status(200).json({ success: true, message: 'Opportunity removed from bookmarks', data: user.savedOpportunities });
        } else {
            // Agar saved nahi hai, toh add kar do (Bookmark)
            user.savedOpportunities.push({ opportunityId, onModel });
            await user.save();
            return res.status(200).json({ success: true, message: 'Opportunity saved successfully 🎉', data: user.savedOpportunities });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get logged in user's profile with fully populated bookmarks!
// @route   GET /api/users/profile
// @access  Private/Student
const getUserProfile = async (req, res) => {
    try {
        // Mongoose Ref Path magic: Yeh automatically correct table se data fetch karke join (populate) kar dega ✨
        const user = await User.findById(req.user._id).populate('savedOpportunities.opportunityId');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { toggleBookmark, getUserProfile };