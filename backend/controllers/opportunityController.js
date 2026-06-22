// backend/controllers/opportunityController.js
const Internship = require('../models/Internship'); // Apne exact paths use karein
const Hackathon = require('../models/Hackathon');
const Scholarship = require('../models/Scholarship');
const ExtraActivity = require('../models/ExtraActivity');

// @desc    Get all active opportunities based on stream type
// @route   GET /api/opportunities/:stream
const getOpportunitiesByStream = async (req, res, next) => {
  try {
    const { stream } = req.params;
    const { search, locationType, mode } = req.query;

    let Model;
    let queryCondition = { deadline: { $gte: new Date() } }; // Bas active deadlines dikhayega

    // 1. Map target collection stream
    switch (stream.toLowerCase()) {
      case 'internships': Model = Internship; break;
      case 'hackathons': Model = Hackathon; break;
      case 'scholarships': Model = Scholarship; break;
      case 'activities': Model = ExtraActivity; break;
      default:
        res.status(400);
        throw new Error('Invalid opportunity stream segment.');
    }

    // 2. Inject Search Filter (Title or Company/Organizer matching)
    if (search) {
      queryCondition.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } }
      ].filter(condition => Object.values(condition)[0].$regex !== undefined); 
      // Filter out fields that don't exist on specific schemas to avoid Mongoose validation crash
    }

    // 3. Inject Dropdown Filters dynamically
    if (locationType && locationType !== 'All') {
      queryCondition.locationType = locationType;
    }
    if (mode && mode !== 'All') {
      queryCondition.mode = mode;
    }

    // 4. Execute Query (Sorted by earliest deadline first)
    const data = await Model.find(queryCondition).sort({ deadline: 1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

const trackAndRedirect = async (req, res, next) => {
  try {
    const { stream, id } = req.params;
    let Model;

    // 1. Map target collection stream
    switch (stream.toLowerCase()) {
      case 'internships': Model = Internship; break;
      case 'hackathons': Model = Hackathon; break;
      case 'scholarships': Model = Scholarship; break;
      case 'activities': Model = ExtraActivity; break;
      default:
        res.status(400);
        throw new Error('Invalid opportunity stream segment.');
    }

    // 2. Find the opportunity and increment click counter by 1 atomic unit
    const opportunity = await Model.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } }, // Atomic increment operation
      { new: true }
    );

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity data packet not found.');
    }

    // 3. Extract final redirection endpoint (Affiliate Link gets priority if available)
    const targetUrl = opportunity.affiliateLink || opportunity.applyLink;

    // 4. Perform safe redirect
    return res.redirect(targetUrl);

  } catch (error) {
    next(error);
  }
};

module.exports = { getOpportunitiesByStream, trackAndRedirect };