import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Game from './pages/Game';
import Logout from './pages/Logout';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/lggout" element={<Logout />}></Route>
      <Route path="/game" element={<Game />}></Route>
    </Routes>
  </Router>
  );
}

export default App;
