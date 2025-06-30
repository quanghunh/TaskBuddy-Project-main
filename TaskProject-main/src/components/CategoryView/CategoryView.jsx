import React, { useState } from 'react';
import TaskGrid from '../TaskGrid/TaskGrid';
import './CategoryView.css';

export default function CategoryView({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleStatus, 
  onAddTask,
  onCategorySelect 
}) {
  const [selectedCategoryView, setSelectedCategoryView] = useState(null);

  // Get all unique categories with task counts
  const getCategoriesWithCounts = () => {
    const categoryMap = {};
    
    tasks.forEach(task => {
      const category = task.category || 'General';
      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          total: 0,
          completed: 0,
          pending: 0,
          tasks: []
        };
      }
      categoryMap[category].total++;
      categoryMap[category].tasks.push(task);
      if (task.completed) {
        categoryMap[category].completed++;
      } else {
        categoryMap[category].pending++;
      }
    });

    return Object.values(categoryMap).sort((a, b) => b.total - a.total);
  };

  const categories = getCategoriesWithCounts();

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'General': '📋',
      'Work': '💼',
      'Personal': '👤',
      'Health': '🏥',
      'Learning': '📚',
      'Finance': '💰',
      'Shopping': '🛒',
      'Travel': '✈️',
      'Home': '🏠',
      'Fitness': '💪',
      'Food': '🍕',
      'Entertainment': '🎬',
      'Social': '👥',
      'Projects': '🚀'
    };
    return icons[categoryName] || '📁';
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      'General': '#6b7280',
      'Work': '#3b82f6',
      'Personal': '#8b5cf6',
      'Health': '#ef4444',
      'Learning': '#f59e0b',
      'Finance': '#22c55e',
      'Shopping': '#ec4899',
      'Travel': '#06b6d4',
      'Home': '#84cc16',
      'Fitness': '#f97316',
      'Food': '#eab308',
      'Entertainment': '#a855f7',
      'Social': '#14b8a6',
      'Projects': '#f43f5e'
    };
    return colors[categoryName] || '#6b7280';
  };

  const handleCategoryClick = (category) => {
    setSelectedCategoryView(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategoryView(null);
  };

  // If a specific category is selected, show its tasks
  if (selectedCategoryView) {
    return (
      <div className="category-detail-view">
        <div className="category-detail-header">
          <button 
            className="back-to-categories-btn"
            onClick={handleBackToCategories}
          >
            ← Back to Categories
          </button>
          <div className="category-detail-title">
            <span 
              className="category-detail-icon"
              style={{ color: getCategoryColor(selectedCategoryView.name) }}
            >
              {getCategoryIcon(selectedCategoryView.name)}
            </span>
            <h2>{selectedCategoryView.name}</h2>
            <span 
              className="category-detail-count"
              style={{ backgroundColor: getCategoryColor(selectedCategoryView.name) }}
            >
              {selectedCategoryView.total} tasks
            </span>
          </div>
        </div>

        <div className="category-progress">
          <div className="progress-info">
            <span>
              {selectedCategoryView.completed} completed • {selectedCategoryView.pending} pending
            </span>
            <span className="progress-percentage">
              {selectedCategoryView.total > 0 
                ? Math.round((selectedCategoryView.completed / selectedCategoryView.total) * 100)
                : 0}% Complete
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{
                width: `${selectedCategoryView.total > 0 
                  ? (selectedCategoryView.completed / selectedCategoryView.total) * 100 
                  : 0}%`,
                backgroundColor: getCategoryColor(selectedCategoryView.name)
              }}
            />
          </div>
        </div>

        {/* Tasks in this category */}
        <div className="category-tasks-section">
          <TaskGrid 
            tasks={selectedCategoryView.tasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onToggleStatus={onToggleStatus}
            onAddTask={onAddTask}
          />
        </div>
      </div>
    );
  }

  // Default view: Show categories overview only
  return (
    <div className="categories-overview">
      <div className="categories-header">
        <h2>Categories</h2>
        <p>Organize and manage your tasks by categories</p>
      </div>

      {categories.length === 0 ? (
        <div className="empty-categories">
          <div className="empty-icon">📁</div>
          <h3>No Categories Yet</h3>
          <p>Start organizing your tasks by creating categories!</p>
          <button 
            className="create-first-task-btn"
            onClick={onAddTask}
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <>
          <div className="categories-stats">
            <div className="stat-card-mini">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-number">{tasks.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-number">{tasks.filter(t => t.completed).length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <div 
                key={category.name}
                className="category-card"
                onClick={() => handleCategoryClick(category)}
                style={{
                  '--category-color': getCategoryColor(category.name)
                }}
              >
                <div className="category-card-header">
                  <span 
                    className="category-icon"
                    style={{ color: getCategoryColor(category.name) }}
                  >
                    {getCategoryIcon(category.name)}
                  </span>
                  <h3 className="category-name">{category.name}</h3>
                </div>
                
                <div className="category-stats">
                  <div className="stat-item">
                    <span className="stat-number">{category.total}</span>
                    <span className="stat-label">Total</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{category.completed}</span>
                    <span className="stat-label">Done</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{category.pending}</span>
                    <span className="stat-label">Pending</span>
                  </div>
                </div>

                <div className="category-progress-mini">
                  <div className="progress-bar-mini">
                    <div 
                      className="progress-fill-mini"
                      style={{
                        width: `${category.total > 0 
                          ? (category.completed / category.total) * 100 
                          : 0}%`,
                        backgroundColor: getCategoryColor(category.name)
                      }}
                    />
                  </div>
                  <span className="progress-text-mini">
                    {category.total > 0 
                      ? Math.round((category.completed / category.total) * 100)
                      : 0}% Complete
                  </span>
                </div>

                <div className="category-card-footer">
                  <span className="view-tasks-text">
                    Click to view {category.total} tasks →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="categories-actions">
            <button 
              className="add-category-btn"
              onClick={onAddTask}
            >
              <span className="plus-icon">+</span>
              Add New Task
            </button>
          </div>
        </>
      )}
    </div>
  );
}