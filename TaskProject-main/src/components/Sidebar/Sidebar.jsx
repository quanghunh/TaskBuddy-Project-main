import React from 'react';
import './Sidebar.css';

export default function Sidebar({ selectedCategory, onCategorySelect, stats, user, onLogout }) {
  const menuItems = [
    {
      id: 'all',
      name: 'All Tasks',
      icon: '🏠',
      count: stats.allTasks
    },
    {
      id: 'important',
      name: 'Important!',
      icon: '⚠️',
      count: stats.important
    },
    {
      id: 'completed',
      name: 'Completed!',
      icon: '✅',
      count: stats.completed
    },
    {
      id: 'do-it-now',
      name: 'Do It Now',
      icon: '🔒',
      count: stats.doItNow
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-avatar">
            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face" alt="User" />
          </div>
          <div className="user-info">
            <h3>{user?.fullName || 'User'}</h3>
            <p>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <button 
          className="logout-btn"
          onClick={onLogout}
          title="Logout"
        >
          🚪
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${selectedCategory === item.name ? 'active' : ''}`}
            onClick={() => onCategorySelect(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
            {item.count > 0 && (
              <span className="nav-count">{item.count}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}