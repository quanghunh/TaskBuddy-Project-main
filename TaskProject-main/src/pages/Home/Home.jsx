import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import TaskGrid from '../../components/TaskGrid/TaskGrid';
import AddTaskModal from '../../components/AddTaskModal/AddTaskModal';
import TaskChart from '../../components/Chart/TaskChart';
import './Home.css';

export default function Home({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Tasks');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    const task = {
      id: Date.now(),
      ...newTask,
      createdAt: new Date().toLocaleDateString('en-GB'),
      completed: false
    };
    setTasks([...tasks, task]);
    setIsAddModalOpen(false);
  };

  const updateTask = (taskId, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getFilteredTasks = () => {
    switch (selectedCategory) {
      case 'All Tasks':
        return tasks;
      case 'Important!':
        return tasks.filter(task => task.priority === 'High');
      case 'Completed!':
        return tasks.filter(task => task.completed);
      case 'Do It Now':
        return tasks.filter(task => !task.completed && task.priority === 'High');
      default:
        return tasks;
    }
  };

  const getCategoryStats = () => {
    const allTasks = tasks.length;
    const important = tasks.filter(task => task.priority === 'High').length;
    const completed = tasks.filter(task => task.completed).length;
    const doItNow = tasks.filter(task => !task.completed && task.priority === 'High').length;

    return { allTasks, important, completed, doItNow };
  };

  return (
    <div className="home-container">
      <Sidebar 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        stats={getCategoryStats()}
      />
      
      <div className="main-content">
        <div className="content-header">
          <div className="header-left">
            <h1 className="page-title">{selectedCategory}</h1>
            <div className="title-underline"></div>
          </div>
          {selectedCategory !== 'Completed!' && (
            <button 
              className="add-task-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              <span className="plus-icon">+</span>
            </button>
          )}
        </div>

        {selectedCategory === 'Completed!' ? (
          <div className="completed-page">
            {/* Statistics Chart Section */}
            <TaskChart tasks={tasks} />
            
            {/* Completed Tasks Section */}
            <div className="completed-tasks-section">
              <div className="section-header">
                <h2>Completed Tasks</h2>
                <span className="task-count">
                  {getFilteredTasks().length} {getFilteredTasks().length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              
              {getFilteredTasks().length > 0 ? (
                <TaskGrid 
                  tasks={getFilteredTasks()}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onToggleStatus={toggleTaskStatus}
                />
              ) : (
                <div className="empty-completed">
                  <div className="empty-icon">🎯</div>
                  <h3>No Completed Tasks Yet</h3>
                  <p>Complete some tasks to see them here!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <TaskGrid 
              tasks={getFilteredTasks()}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onToggleStatus={toggleTaskStatus}
            />

            {getFilteredTasks().length === 0 && (
              <div className="empty-state">
                <p>No tasks in this category yet.</p>
                <button 
                  className="add-first-task-btn"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add New Task
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isAddModalOpen && (
        <AddTaskModal 
          onAddTask={addTask}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}