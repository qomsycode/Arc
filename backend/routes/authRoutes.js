const express = require('express');
const { syncUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/auth/sync
// Protected by authMiddleware - requires a valid Privy JWT
router.post('/sync', authMiddleware, syncUser);

module.exports = router;
