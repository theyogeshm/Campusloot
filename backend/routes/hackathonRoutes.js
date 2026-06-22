// backend/routes/hackathonRoutes.js
const express = require('express');
const router = express.Router();
const {
    createHackathon,
    getHackathons,
    getHackathonById,
    updateHackathon,
    deleteHackathon
} = require('../controllers/hackathonController');

const adminAuth = require('../middleware/adminAuth');
const { validateObjectId } = require('../middleware/validate');

// Public endpoints
router.route('/').get(getHackathons);
router.route('/:id').get(validateObjectId('id'), getHackathonById);

// Secure endpoints
router.route('/').post(adminAuth, createHackathon);
router.route('/:id')
    .put(adminAuth, validateObjectId('id'), updateHackathon)
    .delete(adminAuth, validateObjectId('id'), deleteHackathon);

module.exports = router;