import React, { useState } from 'react';
import './AddTaskModal.css';

export default function AddTaskModal({ onAddTask, onClose, existingTasks = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'General'
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Get existing categories from tasks
  const getExistingCategories = () => {
    const categories = new Set(existingTasks.map(task => task.category || 'General'));
    return Array.from(categories).sort();
  };

  const existingCategories = getExistingCategories();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      const finalCategory = isCustomCategory ? customCategory.trim() : formData.category;
      onAddTask({
        ...formData,
        category: finalCategory || 'General'
      });
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'General'
      });
      setIsCustomCategory(false);
      setCustomCategory('');
    }
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === 'custom') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
      setFormData({
        ...formData,
        category: e.target.value
      });
    }
  };

  const handleCancelCustomCategory = () => {
    setIsCustomCategory(false);
    setCustomCategory('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <div className="category-input-container">
                <select
                  id="category"
                  name="category"
                  value={isCustomCategory ? 'custom' : formData.category}
                  onChange={handleCategoryChange}
                  disabled={isCustomCategory}
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                  {existingCategories.map(cat => (
                    !['General', 'Work', 'Personal', 'Health', 'Learning'].includes(cat) && (
                      <option key={cat} value={cat}>{cat}</option>
                    )
                  ))}
                  <option value="custom">+ Create New Category</option>
                </select>
                
                {isCustomCategory && (
                  <div className="custom-category-input">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter new category name..."
                      className="custom-category-field"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="cancel-custom-btn"
                      onClick={handleCancelCustomCategory}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}