// backend/routes/superadminRoutes.js
const express = require('express');
const router = express.Router();
const superAdminAuth = require('../middleware/superAdminAuth');
const {
    getUsers,
    getAdmins,
    createAdmin,
    upgradeUser,
    downgradeAdmin,
    deleteAdmin,
    updateAdmin
} = require('../controllers/superadminController');

// All endpoints under /api/superadmin require superAdminAuth
router.use(superAdminAuth);

router.get('/users', getUsers);
router.get('/admins', getAdmins);
router.post('/create-admin', createAdmin);
router.patch('/upgrade/:id', upgradeUser);
router.patch('/downgrade/:id', downgradeAdmin);
router.delete('/delete/:id', deleteAdmin);
router.put('/update/:id', updateAdmin);

module.exports = router;
