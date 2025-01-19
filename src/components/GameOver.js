import React, { useState, useEffect } from 'react';
import { Twitter, Rocket, RotateCcw } from 'lucide-react';

const GameOver = ({ score, onRestart }) => {
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [globalHighScore, setGlobalHighScore] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('https://refactored-disco-7vp7j4xp67x72w5px-3001.app.github.dev/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data.leaderboard.slice(0, 10));
      setGlobalHighScore(data.globalHighScore);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setConnecting(true);
      if (!window.phantom?.solana) {
        window.open('https://phantom.app/', '_blank');
        return;
      }
      const { publicKey } = await window.phantom.solana.connect();
      const walletAddress = publicKey.toString();
      setWallet(walletAddress);
      await submitScore(walletAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const submitScore = async (walletAddress) => {
    try {
      await fetch('https://refactored-disco-7vp7j4xp67x72w5px-3001.app.github.dev/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, wallet: walletAddress }),
      });
      fetchLeaderboard();
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  const truncateWallet = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-3xl w-full max-w-md mx-4 border border-gray-800 shadow-xl">
        <div className="text-center space-y-6">
          {/* Score Section */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Game Over</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Your Score</p>
                <p className="text-3xl font-bold text-white">{score}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">High Score</p>
                <p className="text-3xl font-bold text-white">{globalHighScore}</p>
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-gray-400 text-sm mb-3">Top 10 Players</h3>
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div key={index} className="flex justify-between text-white text-sm">
                  <span className="font-mono">{truncateWallet(entry.wallet)}</span>
                  <span className="font-bold">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-3">
            {!wallet ? (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200"
              >
                {connecting ? 'Connecting...' : 'Save Score'}
              </button>
            ) : (
              <div className="bg-gray-800 py-2 px-4 rounded-xl text-white text-sm font-mono">
                {truncateWallet(wallet)}
              </div>
            )}

            <button
              onClick={onRestart}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200"
            >
              Try Again
            </button>

            {/* Share Icons */}
            <div className="flex justify-center space-x-4 pt-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `I just scored ${score} points! Can you beat me?`
                )}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://pump.fun/coin/52ezjYa79Jgh5UTpqyR1HQVyULi2H8EfEUV2pYEjpump"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Rocket size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOver;