const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { validateContact, validateObjectId } = require('../middleware/validate');
const {
  submitContact,
  getContacts,
  markContactRead,
  deleteContact
} = require('../controllers/contactController');

router.post('/', validateContact, submitContact);
router.get('/', adminAuth, getContacts);
router.patch('/:id', adminAuth, validateObjectId('id'), markContactRead);
router.delete('/:id', adminAuth, validateObjectId('id'), deleteContact);

module.exports = router;
