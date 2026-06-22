const express = require('express');
const router = express.Router();
const { toggleBookmark, getUserProfile } = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');

// All routes here require a valid logged-in user token
router.post('/bookmark', userAuth, toggleBookmark);
router.get('/profile', userAuth, getUserProfile);

// NOTE: /promote-admin route was REMOVED — it was an unauthenticated privilege escalation vulnerability.
// To promote a user to admin, use: mongosh > db.users.updateOne({email:"..."},{$set:{role:"admin"}})

module.exports = router;