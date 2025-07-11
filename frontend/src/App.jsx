// 📁 src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import ProductDetail from './components/ProductDetail';
import { isLoggedIn } from './utils/auth';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  // Watch for login state changes from localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      setLoggedIn(isLoggedIn());
    };

    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  return (
    <BrowserRouter>
      {loggedIn && <Navbar />}
      <Routes>
        {/* Public Route */}
        {/* !loggedIn && <Route path="/" element={<Login />} /> */}
        <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login setLoggedIn={setLoggedIn} />} />


        {/* Protected Routes */}
        {loggedIn && (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/cars/:slug" element={<ProductDetail />} /> 
            <Route path="/" element={<Navigate to="/home" />} />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={loggedIn ? '/home' : '/'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
