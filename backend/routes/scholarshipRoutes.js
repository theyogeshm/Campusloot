// backend/routes/scholarshipRoutes.js
const express = require('express');
const router = express.Router();
const {
    createScholarship,
    getScholarships,
    getScholarshipById,
    updateScholarship,
    deleteScholarship
} = require('../controllers/scholarshipController');

const adminAuth = require('../middleware/adminAuth');
const { validateObjectId } = require('../middleware/validate');

// Public route for students
router.route('/').get(getScholarships);
router.route('/:id').get(validateObjectId('id'), getScholarshipById);

// Secure curator endpoints
router.route('/').post(adminAuth, createScholarship);
router.route('/:id')
    .put(adminAuth, validateObjectId('id'), updateScholarship)
    .delete(adminAuth, validateObjectId('id'), deleteScholarship);

module.exports = router;