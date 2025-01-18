// src/App.js
import React, { useState } from 'react';
import MainScreen from './components/MainScreen';
import Game from './components/Game';

function App() {
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'game'

  const handleStart = () => {
    setCurrentView('game');
  };

  return (
    <div className="App">
      {currentView === 'main' && <MainScreen onStart={handleStart} />}
      {currentView === 'game' && <Game />}
    </div>
  );
}

export default App;
