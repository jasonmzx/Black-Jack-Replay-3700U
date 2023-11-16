import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Game from './pages/Game';
import GameCreation from './pages/GameCreation';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/login" element={<Login />}></Route>

      {/* GAME RELATED PAGES */}

      <Route path="/game" element={<Game />}></Route>
      <Route path="/game/create" element={<GameCreation />}></Route>

    </Routes>
  </Router>
  );
}

export default App;
