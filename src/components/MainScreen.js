import React, { useEffect, useState } from 'react';
import { Twitter, Rocket } from 'lucide-react';

const MainScreen = ({ onStart }) => {
  const [playerPos, setPlayerPos] = useState(0);
  const [direction, setDirection] = useState(1);

  // Floating animation effect for the player sprite
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPos(prev => {
        if (prev >= 20) setDirection(-1);
        if (prev <= -20) setDirection(1);
        return prev + direction;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-screen relative"
      style={{
        backgroundImage: "url('/game/background.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Player sprite with floating animation */}
      <div 
        className="absolute transition-transform"
        style={{
          transform: `translateY(${playerPos}px)`,
          right: '15%',
          top: '30%'
        }}
      >
        <img 
          src="/game/player.png" 
          alt="Player" 
          className="w-16 h-16 animate-bounce"
        />
      </div>

      <div className="z-10 flex flex-col items-center">
        <h1 className="mb-8 text-5xl font-bold text-white drop-shadow-lg">
          Flappy Trump Initiative
        </h1>

        <button
          onClick={onStart}
          className="px-8 py-4 mb-8 text-2xl font-semibold text-white transition-all bg-green-500 rounded-lg hover:bg-green-600 hover:scale-105 focus:outline-none shadow-lg"
        >
          Start Game
        </button>

        {/* Contract and Social Links */}
        <div className="flex flex-col items-center gap-4 p-6 bg-black/30 rounded-lg backdrop-blur-sm">
          <p className="text-lg font-mono text-white">
            Contract: 0x1234...5678
          </p>
          
          <div className="flex gap-6">
            <a 
              href="https://twitter.com/flappybird"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white transition-transform hover:scale-110"
            >
              <Twitter size={24} />
            </a>
            
            <a 
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white transition-transform hover:scale-110"
            >
              <Rocket size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;