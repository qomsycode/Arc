const { markLessonComplete, addXP } = require('../models/progressModel');

// Answer map for all 10 lessons
const LESSONS = {
  1: { rewardAmount: 5.0, questions: { 101: 1, 102: 1, 103: 1 } },
  2: { rewardAmount: 5.0, questions: { 201: 1, 202: 2, 203: 2 } },
  3: { rewardAmount: 5.0, questions: { 301: 2, 302: 0, 303: 1 } },
  4: { rewardAmount: 5.0, questions: { 401: 1, 402: 2, 403: 1 } },
  5: { rewardAmount: 5.0, questions: { 501: 1, 502: 2, 503: 1 } },
  6: { rewardAmount: 5.0, questions: { 601: 1, 602: 2, 603: 1 } },
  7: { rewardAmount: 5.0, questions: { 701: 1, 702: 2, 703: 1 } },
  8: { rewardAmount: 5.0, questions: { 801: 1, 802: 1, 803: 0 } },
  9: { rewardAmount: 5.0, questions: { 901: 1, 902: 1, 903: 1 } },
  10: { rewardAmount: 5.0, questions: { 1001: 1, 1002: 1, 1003: 2 } }
};

const gradeQuiz = async (req, res) => {
  try {
    const { lessonId, answers } = req.body;
    const userId = req.user.id; // From authMiddleware

    const lesson = LESSONS[lessonId];
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    let correctCount = 0;
    const totalQuestions = Object.keys(lesson.questions).length;

    // Grade answers
    for (const [qId, correctIndex] of Object.entries(lesson.questions)) {
      if (answers[qId] === correctIndex) {
        correctCount++;
      }
    }

    const percentage = (correctCount / totalQuestions) * 100;
    const passed = percentage >= 75;

    let xpGiven = false;
    let xpAmount = 0;

    if (passed) {
      // 1. Mark lesson as complete
      await markLessonComplete(userId, lessonId, percentage);

      // 2. Reward 50 XP
      xpAmount = 50;
      await addXP(userId, xpAmount);
      xpGiven = true;
    }

    return res.status(200).json({
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      xpGiven,
      xpAmount
    });

  } catch (error) {
    console.error('Error grading quiz:', error);
    res.status(500).json({ error: 'Server error grading quiz' });
  }
};

module.exports = {
  gradeQuiz
};
