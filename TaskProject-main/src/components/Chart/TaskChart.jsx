import React, { useEffect, useState } from 'react';
import './TaskChart.css';

export default function TaskChart({ tasks }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Animate percentage counter
  useEffect(() => {
    let startTime = null;
    const duration = 1500; // 1.5 seconds

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentPercentage = Math.floor(easeOutQuart * completionPercentage);
      
      setAnimatedPercentage(currentPercentage);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    if (completionPercentage > 0) {
      requestAnimationFrame(animateCount);
    }
  }, [completionPercentage]);

  // Get category breakdown
  const getCategoryStats = () => {
    const categories = {};
    tasks.forEach(task => {
      const category = task.category || 'General';
      if (!categories[category]) {
        categories[category] = { total: 0, completed: 0 };
      }
      categories[category].total++;
      if (task.completed) {
        categories[category].completed++;
      }
    });
    return categories;
  };

  // Get priority breakdown
  const getPriorityStats = () => {
    const priorities = { High: 0, Medium: 0, Low: 0 };
    tasks.filter(task => task.completed).forEach(task => {
      if (priorities.hasOwnProperty(task.priority)) {
        priorities[task.priority]++;
      }
    });
    return priorities;
  };

  const categoryStats = getCategoryStats();
  const priorityStats = getPriorityStats();

  const getCompletionMessage = () => {
    if (completionPercentage === 100) return "🎉 Perfect! All tasks completed!";
    if (completionPercentage >= 80) return "🔥 Almost there! Great progress!";
    if (completionPercentage >= 60) return "💪 Good progress! Keep going!";
    if (completionPercentage >= 40) return "📈 Making progress! You got this!";
    if (completionPercentage >= 20) return "🌱 Just getting started!";
    return "🎯 Time to tackle some tasks!";
  };

  return (
    <div className="chart-container compact">
      <div className="chart-header">
        <h2>Completion Overview</h2>
        <p className="completion-message">{getCompletionMessage()}</p>
      </div>

      <div className="chart-layout">
        {/* Main Circular Chart */}
        <div className="circular-chart-container">
          <div className="circular-chart">
            <svg width="180" height="180" viewBox="0 0 180 180">
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="#404040"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(completionPercentage / 100) * 439.82} 439.82`}
                strokeDashoffset="0"
                className="progress-circle"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '90px 90px'
                }}
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="chart-center">
              <div className="percentage">{animatedPercentage}%</div>
              <div className="chart-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card completed">
            <div className="stat-number">{completedTasks}</div>
            <div className="stat-label">Completed</div>
            <div className="stat-icon">✅</div>
          </div>
          
          <div className="stat-card incomplete">
            <div className="stat-number">{incompleteTasks}</div>
            <div className="stat-label">Remaining</div>
            <div className="stat-icon">📋</div>
          </div>
          
          <div className="stat-card total">
            <div className="stat-number">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
            <div className="stat-icon">📊</div>
          </div>
        </div>
      </div>

      {/* Category & Priority in horizontal layout */}
      <div className="breakdown-grid">
        {/* Category Breakdown */}
        {Object.keys(categoryStats).length > 0 && (
          <div className="breakdown-section">
            <h3>Progress by Category</h3>
            <div className="category-list">
              {Object.entries(categoryStats).map(([category, stats]) => {
                const categoryPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                return (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <span className="category-name">{category}</span>
                      <span className="category-stats">
                        {stats.completed}/{stats.total} ({categoryPercentage}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{
                          width: `${categoryPercentage}%`,
                          animationDelay: `${Object.keys(categoryStats).indexOf(category) * 0.2}s`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Priority Breakdown */}
        {completedTasks > 0 && (
          <div className="breakdown-section">
            <h3>Completed by Priority</h3>
            <div className="priority-bars">
              {Object.entries(priorityStats).map(([priority, count]) => (
                <div key={priority} className={`priority-bar priority-${priority.toLowerCase()}`}>
                  <div className="priority-label">
                    <span>{priority}</span>
                    <span>{count} tasks</span>
                  </div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{
                        width: completedTasks > 0 ? `${(count / completedTasks) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {totalTasks === 0 && (
        <div className="empty-chart">
          <div className="empty-icon">📈</div>
          <h3>No Tasks Yet</h3>
          <p>Add some tasks to see your completion statistics!</p>
        </div>
      )}
    </div>
  );
}