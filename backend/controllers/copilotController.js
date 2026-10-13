const { askCopilot } = require('../services/copilotService');

const chatWithCopilot = async (req, res) => {
  try {
    const { prompt, history } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'A valid prompt is required.' });
    }

    // Limit prompt length to prevent abuse
    if (prompt.length > 2000) {
      return res.status(400).json({ error: 'Prompt exceeds maximum length of 2000 characters.' });
    }

    const reply = await askCopilot(prompt.trim(), Array.isArray(history) ? history.slice(-6) : []);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Copilot Controller Error:', error.message);
    return res.status(500).json({ 
      error: error.message || 'Failed to process request with Arc Copilot.' 
    });
  }
};

module.exports = {
  chatWithCopilot
};
