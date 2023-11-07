import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/login" element={<Login />}></Route>
    </Routes>
  </Router>
  );
}

export default App;
