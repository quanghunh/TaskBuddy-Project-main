import React, { useState, useEffect } from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(true);

  // Initialize demo user and setup
  useEffect(() => {
    // Always start with no user logged in
    localStorage.removeItem('currentUser');
    
    // Create demo user if not exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find(u => u.email === 'demo@example.com')) {
      const demoUser = {
        id: 1,
        fullName: 'Demo User',
        email: 'demo@example.com',
        password: '123456',
        createdAt: new Date().toISOString()
      };
      users.push(demoUser);
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setAuthMode('login');
  };

  const switchToRegister = () => {
    setAuthMode('register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading TaskBuddy...</p>
      </div>
    );
  }

  // If user is logged in, show the main app
  if (currentUser) {
    return (
      <div className="App">
        <Home user={currentUser} onLogout={handleLogout} />
      </div>
    );
  }

  // Always show auth forms first
  return (
    <div className="App">
      {authMode === 'login' ? (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
}