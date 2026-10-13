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
    const passed = percentage >= 80;

    let xpGiven = false;
    let xpAmount = 0;
    let rewardTxHash = null;
    let rewardStatus = 'none'; // 'none' | 'sent' | 'pending' | 'already_claimed' | 'error'

    if (passed) {
      // 1. Mark lesson as complete
      await markLessonComplete(userId, lessonId, percentage);

      // 2. Web3 Reward & XP Integration (strict 1-time-per-lesson rule)
      try {
        const supabase = require('../db/supabaseClient');
        const { sendQuizReward } = require('../services/web3Service');
        const { logReward } = require('../models/rewardsModel');

        // Check if reward (or a queued pending reward) already exists for this lesson
        const { data: existingReward } = await supabase
          .from('rewards_log')
          .select('id, tx_hash, reward_type')
          .eq('user_id', userId)
          .in('reward_type', [
            `quiz_pass_lesson_${lessonId}`,
            `pending_reward_lesson_${lessonId}`
          ])
          .maybeSingle();

        if (existingReward) {
          console.log(`User ${userId} already has reward/pending entry for lesson ${lessonId}. Skipping.`);
          rewardTxHash = existingReward.tx_hash || null;
          rewardStatus = existingReward.reward_type.startsWith('pending_')
            ? 'pending'
            : 'already_claimed';
        } else {
          // First-time pass — award XP unconditionally
          xpAmount = 50;
          await addXP(userId, xpAmount);
          xpGiven = true;

          // Fetch user's connected wallet address
          const { data: profile } = await supabase
            .from('profiles')
            .select('wallet_address')
            .eq('id', userId)
            .single();

          if (profile && profile.wallet_address) {
            const result = await sendQuizReward(profile.wallet_address, lessonId);

            if (result.status === 'sent') {
              // Reward dispatched on-chain — log with unique per-lesson key
              rewardTxHash = result.txHash;
              rewardStatus = 'sent';
              await logReward(userId, 0.01, `quiz_pass_lesson_${lessonId}`, rewardTxHash);

            } else if (result.status === 'insufficient_funds') {
              // Contract is empty — queue the reward for later processing
              rewardStatus = 'pending';
              await logReward(userId, 0.01, `pending_reward_lesson_${lessonId}`, null);
              console.log(`Pending reward queued for user ${userId}, lesson ${lessonId}.`);

            } else {
              // Unexpected error — don't queue so admin can retry manually
              rewardStatus = 'error';
              console.error(`sendQuizReward returned error for user ${userId}, lesson ${lessonId}.`);
            }
          } else {
            console.log(`User ${userId} passed but has no wallet address connected.`);
          }
        }
      } catch (err) {
        console.error('Failed to process Web3 reward:', err);
      }
    }

    return res.status(200).json({
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      xpGiven,
      xpAmount,
      rewardTxHash,
      rewardStatus,
      rewardAmount: rewardTxHash ? 0.01 : 0
    });

  } catch (error) {
    console.error('Error grading quiz:', error);
    res.status(500).json({ error: 'Server error grading quiz' });
  }
};

module.exports = {
  gradeQuiz
};
