const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ARCademy API', network: 'Arc L1' });
});

// Quiz Answer Verification Route (Prevents Client-Side Cheating)
app.post('/api/quiz/grade', (req, res) => {
  const { lessonId, answers } = req.body;
  // Quiz grading logic will be evaluated here
  res.json({ success: true, score: 100, reward: 0.05 });
});

// Build Challenge Submission Route
app.post('/api/submissions/create', (req, res) => {
  const { userId, challengeId, githubUrl, liveUrl, walletAddress } = req.body;
  res.json({ success: true, submissionId: 104, status: 'pending' });
});

app.listen(PORT, () => {
  console.log(`ARCademy Backend API running on port ${PORT}`);
});
