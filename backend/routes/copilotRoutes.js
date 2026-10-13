const express = require('express');
const router = express.Router();
const { chatWithCopilot } = require('../controllers/copilotController');
const { verifyPrivyToken } = require('../middlewares/authMiddleware');

// Protected route — requires valid Privy access token
router.post('/chat', verifyPrivyToken, chatWithCopilot);

module.exports = router;
