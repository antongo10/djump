// src/App.js
import React, { useState } from 'react';
import MainScreen from './components/MainScreen';
import Game from './components/Game';

function App() {
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'game'

  const handleStart = () => {
    setCurrentView('game');
  };

  const handleGameOver = () => {
    setCurrentView('main');
  };

  return (
    <div className="App">
      {currentView === 'main' && <MainScreen onStart={handleStart} />}
      {currentView === 'game' && <Game onGameOver={handleGameOver} />}
    </div>
  );
}

export default App;
