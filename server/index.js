require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// File path for persisting scores
const SCORES_FILE = path.join(__dirname, 'scores.json');

// Webhook URL for Make.com
const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || 'https://hook.make.com/your-webhook-url';

// In-memory store for scores
let scores = new Map();
let globalHighScore = 0;

// Load saved scores on startup
async function loadScores() {
  try {
    const data = await fs.readFile(SCORES_FILE, 'utf8');
    const savedData = JSON.parse(data);
    scores = new Map(savedData.scores);
    globalHighScore = savedData.globalHighScore;
    console.log('Loaded saved scores successfully');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error loading scores:', error);
    }
    scores = new Map();
    globalHighScore = 0;
  }
}

// Save scores to file
async function saveScores() {
  try {
    const data = {
      scores: Array.from(scores.entries()),
      globalHighScore
    };
    await fs.writeFile(SCORES_FILE, JSON.stringify(data, null, 2));
    console.log('Scores saved successfully');
  } catch (error) {
    console.error('Error saving scores:', error);
  }
}

// Function to send webhook to Make.com
async function sendWebhook(data) {
  try {
    const response = await axios.post(WEBHOOK_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Webhook sent successfully:', response.status);
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

// Submit new score
app.post('/api/scores', async (req, res) => {
  try {
    const { score, wallet } = req.body;

    if (typeof score !== 'number' || typeof wallet !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing required fields' });
    }

    console.log('Received score submission:', { score, wallet });

    const currentHighScore = scores.get(wallet) || 0;
    let isNewGlobalHighScore = false;

    // Update personal best if the new score is higher
    if (score > currentHighScore) {
      scores.set(wallet, score);
      
      // Check for new global high score
      if (score > globalHighScore) {
        globalHighScore = score;
        isNewGlobalHighScore = true;
        console.log(`New global high score: ${score} by ${wallet}`);

        // Prepare data for the webhook
        const webhookData = {
          wallet: wallet,
          score: score,
          timestamp: new Date().toISOString()
        };

        // Send webhook asynchronously
        sendWebhook(webhookData);
      }

      // Save scores to file after update
      await saveScores();
    }

    return res.json({
      success: true,
      newGlobalHighScore: isNewGlobalHighScore,
      personalBest: Math.max(currentHighScore, score),
      globalHighScore
    });
  } catch (error) {
    console.error('Error processing score submission:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([wallet, score]) => ({
        wallet: `${wallet.slice(0, 4)}...${wallet.slice(-4)}`,
        score
      }));

    res.json({ leaderboard, globalHighScore });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize scores on startup
loadScores();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
