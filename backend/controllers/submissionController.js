const { createSubmission, getUserSubmissions, getAllSubmissions, updateSubmissionStatus } = require('../models/submissionModel');
const { logReward } = require('../models/rewardsModel');

// Hardcoded map of challenge bounty amounts
const BOUNTIES = {
  1: 20.0,
  2: 25.0,
  3: 40.0,
  4: 50.0,
  5: 45.0,
  6: 75.0
};

const submitChallenge = async (req, res) => {
  try {
    const { challengeId, githubUrl, liveUrl, walletAddress } = req.body;
    const userId = req.user.id;

    if (!challengeId || !githubUrl) {
      return res.status(400).json({ error: 'challengeId and githubUrl are required' });
    }

    const submission = await createSubmission(userId, Number(challengeId), githubUrl, liveUrl, walletAddress);
    return res.status(201).json({ message: 'Submission received successfully', submission });
  } catch (error) {
    console.error('Error submitting challenge:', error);
    return res.status(500).json({ error: 'Server error creating submission' });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await getUserSubmissions(userId);
    return res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({ error: 'Server error fetching submissions' });
  }
};

const listAllSubmissions = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    return res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    return res.status(500).json({ error: 'Server error fetching submissions' });
  }
};

const reviewSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, feedback } = req.body; // status: 'approved' | 'needs_improvement'

    if (!['approved', 'needs_improvement'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await updateSubmissionStatus(submissionId, status, feedback);

    // If approved, trigger payout & log reward
    if (status === 'approved') {
      const bountyAmount = BOUNTIES[updated.challenge_id] || 25.0;
      const txHash = `escrow_payout_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await logReward(updated.user_id, bountyAmount, 'challenge_bounty', txHash);
    }

    return res.status(200).json({ message: 'Submission updated', submission: updated });
  } catch (error) {
    console.error('Error reviewing submission:', error);
    return res.status(500).json({ error: 'Server error reviewing submission' });
  }
};

module.exports = {
  submitChallenge,
  getMySubmissions,
  listAllSubmissions,
  reviewSubmission
};
