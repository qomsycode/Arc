const express = require('express');
const { gradeQuiz } = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/grade', authMiddleware, gradeQuiz);

module.exports = router;
