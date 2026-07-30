const { getUserProgress } = require('../models/progressModel');

const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await getUserProgress(userId);
    res.status(200).json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
};

module.exports = {
  getProgress
};
