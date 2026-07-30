const express = require('express');
const { 
  submitChallenge, 
  getMySubmissions, 
  listAllSubmissions, 
  reviewSubmission 
} = require('../controllers/submissionController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRole');

const router = express.Router();

// User routes
router.post('/submit', authMiddleware, submitChallenge);
router.get('/my', authMiddleware, getMySubmissions);

// Admin routes — protected by role check
router.get('/admin/all', authMiddleware, requireRole('admin', 'reviewer'), listAllSubmissions);
router.post('/admin/review/:submissionId', authMiddleware, requireRole('admin', 'reviewer'), reviewSubmission);

module.exports = router;
