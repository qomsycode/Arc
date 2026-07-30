const express = require('express');
const { 
  submitChallenge, 
  getMySubmissions, 
  listAllSubmissions, 
  reviewSubmission 
} = require('../controllers/submissionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// User routes
router.post('/submit', authMiddleware, submitChallenge);
router.get('/my', authMiddleware, getMySubmissions);

// Admin routes
router.get('/admin/all', authMiddleware, listAllSubmissions);
router.post('/admin/review/:submissionId', authMiddleware, reviewSubmission);

module.exports = router;
