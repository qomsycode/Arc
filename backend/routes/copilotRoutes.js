const express = require('express');
const router = express.Router();
const { chatWithCopilot } = require('../controllers/copilotController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected route — requires valid Privy access token
router.post('/chat', authMiddleware, chatWithCopilot);

module.exports = router;
