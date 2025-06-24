 import React, { useState } from 'react';
import './TaskCard.css';


export default function TaskCard({ task, onUpdateTask, onDeleteTask, onToggleStatus }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleSaveEdit = () => {
    onUpdateTask(task.id, {
      title: editedTitle,
      description: editedDescription
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="edit-title-input"
            autoFocus
          />
        ) : (
          <h3 className="task-title">{task.title}</h3>
        )}
      </div>

      <div className="task-card-body">
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="edit-description-input"
            rows="3"
          />
        ) : (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-card-footer">
        <div className="task-info">
          <span className="task-date">{task.createdAt}</span>
          <span className={`task-priority ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <div className="task-actions">
          {isEditing ? (
            <>
              <button 
                className="action-btn save-btn"
                onClick={handleSaveEdit}
                title="Save"
              >
                ✓
              </button>
              <button 
                className="action-btn cancel-btn"
                onClick={handleCancelEdit}
                title="Cancel"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button 
                className={`action-btn status-btn ${task.completed ? 'completed' : 'incomplete'}`}
                onClick={() => onToggleStatus(task.id)}
                title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
              >
                {task.completed ? 'Completed' : 'Incomplete'}
              </button>
              <button 
                className="action-btn edit-btn"
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                ✏️
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => onDeleteTask(task.id)}
                title="Delete"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
