const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// POST route for subscription
router.post('/subscribe', subscriptionController.subscribe);

module.exports = router;
