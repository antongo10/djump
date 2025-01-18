import React from 'react';
import { Twitter, Rocket, Wallet, RotateCcw } from 'lucide-react';

const GameOver = ({ score, highScore, onRestart }) => {
  const shareOnTwitter = () => {
    const text = encodeURIComponent(`I just scored ${score} points in the Flappy Trump Initiative! Can you beat me? #FlappyTrump`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const visitPumpFun = () => {
    window.open('https://pump.fun', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full mx-4">
        {/* Decorative elements */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-red-500 rounded-full flex items-center justify-center border-4 border-gray-800 shadow-xl">
          <span className="text-4xl">💀</span>
        </div>
        
        {/* Game Over Text with glow effect */}
        <h2 className="text-5xl font-bold text-center mt-8 mb-6 text-white animate-pulse">
          Game Over!
        </h2>
        
        {/* Score display with gradient text */}
        <div className="space-y-3 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              Score: {score}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-200 bg-clip-text text-transparent">
              High Score: {highScore}
            </p>
          </div>
        </div>

        {/* Action Buttons with improved styling */}
        <div className="flex flex-col gap-3">
          <button
            onClick={shareOnTwitter}
            className="group relative flex items-center justify-center w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Twitter className="mr-2 group-hover:animate-bounce" size={20} />
            Share Score
          </button>

          <button
            onClick={visitPumpFun}
            className="group relative flex items-center justify-center w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Rocket className="mr-2 group-hover:animate-spin" size={20} />
            Visit Pump Fun
          </button>

          <button
            onClick={onRestart}
            className="group relative flex items-center justify-center w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <RotateCcw className="mr-2 group-hover:animate-spin" size={20} />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;