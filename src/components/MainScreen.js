import React, { useEffect, useState } from 'react';
import { Twitter, Rocket, Github } from 'lucide-react';

const MainScreen = ({ onStart }) => {
  const [playerPos, setPlayerPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const [copied, setCopied] = useState(false);
  const contractAddress = '';

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/game/background.webp')"
      }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Player sprite */}
      <div
        className="absolute transition-transform duration-300"
        style={{
          transform: `translateY(${playerPos}px)`,
          right: '15%',
          top: '30%'
        }}
      >
        <img
          src="/game/player.png"
          alt="Player"
          className="w-20 h-20 animate-bounce"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl px-6">
        <h1 className="mb-8 text-5xl font-bold text-white text-center leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Trump Minigame
          </span>
          <br />
          <span className="text-3xl font-normal">
            An open-source autonomous gaming framework
          </span>
        </h1>

        {/* Start button with enhanced hover effects */}
        <button
          onClick={onStart}
          className="relative px-12 py-6 mb-12 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl 
                     hover:from-green-400 hover:to-green-500 transform hover:scale-105 transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          Start Game
          <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
        </button>

        {/* Contract and social links card */}
        <div className="flex flex-col items-center gap-6 p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
          <div 
            className="group relative cursor-pointer"
            onClick={copyToClipboard}
          >
            <p className="text-lg font-mono text-white/90 select-all transition-colors group-hover:text-white">
              Contract: {contractAddress}
            </p>
            {copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm text-green-400 bg-black/90 rounded-full">
                Copied! ✓
              </span>
            )}
          </div>

          {/* Social links with improved hover effects */}
          <div className="flex gap-8">
            <a
              href="https://x.com/trumpgameonsol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-white/80 hover:text-white bg-white/5 rounded-full transition-all hover:scale-110 hover:bg-white/10"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://pump.fun/coin/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-white/80 hover:text-white bg-white/5 rounded-full transition-all hover:scale-110 hover:bg-white/10"
            >
              <Rocket size={24} />
            </a>
            <a
              href="https://github.com/antongo10/flappytrump"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-white/80 hover:text-white bg-white/5 rounded-full transition-all hover:scale-110 hover:bg-white/10"
            >
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;