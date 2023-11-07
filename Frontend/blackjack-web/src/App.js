import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Game from './pages/Game';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/game" element={<Game />}></Route>
    </Routes>
  </Router>
  );
}

export default App;
