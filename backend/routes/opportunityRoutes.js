const express = require('express');
const router = express.Router();
const { getOpportunitiesByStream,trackAndRedirect} = require('../controllers/opportunityController');

router.get('/:stream', getOpportunitiesByStream);
router.get('/redirect/:stream/:id', trackAndRedirect);
module.exports = router;