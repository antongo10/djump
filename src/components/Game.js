// src/components/Game.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameOver from './GameOver';

const GRAVITY = 0.6;
const FLAP_STRENGTH = -12;
const PIPE_SPEED = 4;
const PIPE_WIDTH = 80;
const BIRD_WIDTH = 70; // Adjusted for image size
const BIRD_HEIGHT = 70; // Adjusted for image size
const PIPE_GAP = 350;

const Game = () => { // Removed onGameOver prop
  const [birdPos, setBirdPos] = useState(250);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [isFlapping, setIsFlapping] = useState(false); // For flap animation
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('highScore')) || 0;
  });
  
  // State to track the trail positions
  const [birdTrail, setBirdTrail] = useState([]);

  const gameLoopRef = useRef();
  const pipeGeneratorRef = useRef();

  // Memoize handleStart to prevent unnecessary re-renders
  const handleStart = useCallback(() => {
    if (gameOver) {
      setBirdPos(250);
      setScore(0);
      setPipes([]);
      setGameOver(false);
      setVelocity(0);
      setBirdTrail([]); // Reset trail on restart
    }
    setGameStarted(true);
  }, [gameOver]);

  // Memoize handleFlap and include dependencies
  const handleFlap = useCallback(() => {
    if (!gameStarted) {
      handleStart();
    }
    setVelocity(FLAP_STRENGTH);
    setIsFlapping(true);
    // Play flap sound (Optional)
    // flapSound.currentTime = 0;
    // flapSound.play();
    setTimeout(() => setIsFlapping(false), 200); // Shorter duration for a snappier flap
  }, [gameStarted, handleStart]);

  // Memoize handleRestart
  const handleRestart = useCallback(() => {
    // Update high score if necessary
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
    }
    // Reset game state
    setBirdPos(250);
    setScore(0);
    setPipes([]);
    setGameOver(false);
    setVelocity(0);
    setGameStarted(false);
    setBirdTrail([]); // Reset trail on restart
  }, [score, highScore]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        handleFlap();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, handleFlap]); // Include handleFlap in dependencies

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const generatePipe = () => {
        const height = Math.random() * (window.innerHeight - PIPE_GAP - 100) + 50;
        setPipes(prev => [...prev, { left: window.innerWidth, height, passed: false }]);
      };

      pipeGeneratorRef.current = setInterval(generatePipe, 2500);
      generatePipe();

      return () => clearInterval(pipeGeneratorRef.current);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameLoop = () => {
        setBirdPos(prev => {
          const newPos = prev + velocity;
          if (newPos > window.innerHeight - 100 || newPos < 0) {
            setGameOver(true);
            return prev;
          }
          return newPos;
        });

        setVelocity(prev => prev + GRAVITY);

        setPipes(prev => {
          const newPipes = prev
            .map(pipe => ({
              ...pipe,
              left: pipe.left - PIPE_SPEED,
            }))
            .filter(pipe => pipe.left + PIPE_WIDTH > 0);

          // Check collisions
          newPipes.forEach(pipe => {
            const birdLeft = 100;
            const birdRight = 100 + BIRD_WIDTH;
            const birdTop = birdPos;
            const birdBottom = birdPos + BIRD_HEIGHT;

            const pipeLeft = pipe.left;
            const pipeRight = pipe.left + PIPE_WIDTH;
            const pipeTopHeight = pipe.height;
            const pipeBottomTop = pipe.height + PIPE_GAP;

            if (
              birdRight > pipeLeft &&
              birdLeft < pipeRight &&
              (birdTop < pipeTopHeight || birdBottom > pipeBottomTop)
            ) {
              setGameOver(true);
            }
          });

          // Update score
          newPipes.forEach(pipe => {
            if (pipe.left + PIPE_WIDTH < 100 && !pipe.passed) {
              setScore(prev => prev + 1);
              pipe.passed = true;
            }
          });

          return newPipes;
        });

        // Update bird trail
        setBirdTrail(prev => {
          // Shift existing trail points to the left based on PIPE_SPEED
          const shifted = prev.map(point => ({ x: point.x - PIPE_SPEED, y: point.y }));
          // Remove points that are off-screen
          const filtered = shifted.filter(point => point.x >= 0);
          // Add new point at the bird's current position
          return [...filtered, { x: 100, y: birdPos }].slice(-100); // Limit trail length to last 100 points
        });

        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };

      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return () => cancelAnimationFrame(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, velocity, birdPos]); // Removed onGameOver from dependencies

  useEffect(() => {
    if (gameOver) {
      // Update high score if necessary
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('highScore', score);
      }
    }
  }, [gameOver, score, highScore]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden cursor-pointer"
      onClick={handleFlap}
      style={{
        backgroundImage: `url('/game/background.webp')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Bird Trail */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {birdTrail.slice(1).map((point, index) => {
          const prevPoint = birdTrail[index];
          if (!prevPoint) return null;

          const isGoingUp = point.y < prevPoint.y;
          const lineColor = isGoingUp ? 'green' : 'red';

          return (
            <line
              key={index}
              x1={prevPoint.x}
              y1={prevPoint.y}
              x2={point.x}
              y2={point.y}
              stroke={lineColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Bird */}
      <img
        src="/game/player.png"
        alt="Player"
        className={`absolute ${isFlapping ? 'flap-animation' : ''}`}
        style={{
          left: '100px',
          top: `${birdPos}px`,
          width: `${BIRD_WIDTH}px`,
          height: `${BIRD_HEIGHT}px`,
          transform: `rotate(${velocity * 2}deg)`,
          transition: 'transform 0.1s',
        }}
      />

      {/* Pipes */}
      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          {/* Top pipe */}
          <img
            src="/game/obstacle1.png"
            alt="Pipe Top"
            className="absolute"
            style={{
              left: `${pipe.left}px`,
              top: 0,
              width: `${PIPE_WIDTH}px`,
              height: `${pipe.height}px`,
              transform: 'scaleY(-1)', // Flip vertically for top pipe
            }}
          />
          {/* Bottom pipe */}
          <img
            src="/game/obstacle1.png"
            alt="Pipe Bottom"
            className="absolute"
            style={{
              left: `${pipe.left}px`,
              top: `${pipe.height + PIPE_GAP}px`,
              width: `${PIPE_WIDTH}px`,
              height: `${window.innerHeight - (pipe.height + PIPE_GAP)}px`,
            }}
          />
        </React.Fragment>
      ))}

      {/* Ground */}
      <div
        className="absolute bottom-0 w-full h-24"
        style={{
          backgroundImage: `url('/game/ground.png')`, // Optional: Add ground image
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat-x',
        }}
      />

      {/* Score */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl text-white font-bold">
        {score}
      </div>

      {/* High Score */}
      <div className="absolute top-8 left-8 text-2xl text-white font-bold">
        High Score: {highScore}
      </div>

      {/* Game Over Component */}
      {gameOver && (
        <GameOver 
          score={score}
          highScore={highScore}
          onRestart={handleRestart}
        />
      )}

      {/* Start message */}
      {!gameStarted && !gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-white font-bold">
          Click or Press Space to Start
        </div>
      )}

      {/* Flap Animation Keyframes */}
      <style jsx>{`
        @keyframes flap {
          0% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(-20deg) translateY(-10px); }
          100% { transform: rotate(0deg) translateY(0); }
        }

        .flap-animation {
          animation: flap 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Game;
