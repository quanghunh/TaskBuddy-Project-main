import React from 'react';
import TaskCard from '../TaskCard/TaskCard';
import './TaskGrid.css';

export default function TaskGrid({ tasks, onUpdateTask, onDeleteTask, onToggleStatus, onAddTask }) {
  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onToggleStatus={onToggleStatus}
        />
      ))}
      
      {/* Add New Task Card - always visible at the end */}
      <div className="add-task-card" onClick={onAddTask}>
        <div className="add-task-content">
          <div className="add-icon">+</div>
          <p>Add New Task</p>
        </div>
      </div>
    </div>
  );
}