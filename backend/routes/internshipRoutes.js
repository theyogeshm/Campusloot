// backend/routes/internshipRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createInternship, 
    getInternships, 
    getInternshipById,
    updateInternship, 
    deleteInternship 
} = require('../controllers/internController');

// Security Middlewares Import
const adminAuth = require('../middleware/adminAuth');
const { validateObjectId } = require('../middleware/validate');

// Public route: Koi bhi student internships dekh sake
router.route('/').get(getInternships);
router.route('/:id').get(validateObjectId('id'), getInternshipById);

// Private/Admin routes: Sirf login admins hi listings badal sakein
router.route('/').post(adminAuth, createInternship);
router.route('/:id')
    .put(adminAuth, validateObjectId('id'), updateInternship)
    .delete(adminAuth, validateObjectId('id'), deleteInternship);

module.exports = router;