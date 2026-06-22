const express = require('express');
const router = express.Router();
const { createActivity, getActivities, getActivityById, updateActivity, deleteActivity } = require('../controllers/activityController');
const adminAuth = require('../middleware/adminAuth');
const { validateObjectId } = require('../middleware/validate');

router.route('/').get(getActivities).post(adminAuth, createActivity);
router.route('/:id')
    .get(validateObjectId('id'), getActivityById)
    .put(adminAuth, validateObjectId('id'), updateActivity)
    .delete(adminAuth, validateObjectId('id'), deleteActivity);

module.exports = router;