// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// ─── PUBLIC: Admin login (no middleware — this is the auth endpoint itself) ───
router.post('/login', adminLogin);

// ─── PROTECTED: Any future admin-only API routes go below (require adminAuth) ─
// Example: router.get('/stats', adminAuth, getStats);

module.exports = router;
