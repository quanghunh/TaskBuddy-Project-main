import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import TaskGrid from '../../components/TaskGrid/TaskGrid';
import AddTaskModal from '../../components/AddTaskModal/AddTaskModal';
import AITaskGenerator from '../../components/AITaskGenerator/AITaskGenerator';
import TaskChart from '../../components/Chart/TaskChart';
import CategoryView from '../../components/CategoryView/CategoryView';
import './Home.css';

export default function Home({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Tasks');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
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

  const addMultipleTasks = (newTasks) => {
    const tasksWithIds = newTasks.map((task, index) => ({
      id: Date.now() + index,
      ...task,
      createdAt: new Date().toLocaleDateString('en-GB'),
      completed: false
    }));
    setTasks([...tasks, ...tasksWithIds]);
    setIsAIModalOpen(false);
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
      case 'Categories':
        return [];
      default:
        return tasks;
    }
  };

  const getCategoryStats = () => {
    const allTasks = tasks.length;
    const important = tasks.filter(task => task.priority === 'High').length;
    const completed = tasks.filter(task => task.completed).length;
    
    // Get unique categories count
    const uniqueCategories = new Set(tasks.map(task => task.category || 'General'));
    const categories = uniqueCategories.size;

    return { allTasks, important, completed, categories };
  };

  const renderMainContent = () => {
    if (selectedCategory === 'Categories') {
      return (
        <CategoryView 
          tasks={tasks}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onToggleStatus={toggleTaskStatus}
          onAddTask={() => setIsAddModalOpen(true)}
          onCategorySelect={setSelectedCategory}
        />
      );
    }

    if (selectedCategory === 'Completed!') {
      return (
        <div className="completed-page">
          <TaskChart tasks={tasks} />
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
                onAddTask={() => setIsAddModalOpen(true)}
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
      );
    }

    return (
      <>
        <TaskGrid 
          tasks={getFilteredTasks()}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onToggleStatus={toggleTaskStatus}
          onAddTask={() => setIsAddModalOpen(true)}
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
    );
  };

  return (
    <div className="home-container">
      <Sidebar 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        stats={getCategoryStats()}
        user={user}
        onLogout={onLogout}
      />
      
      <div className="main-content">
        <div className="content-header">
          <div className="header-left">
            <h1 className="page-title">{selectedCategory}</h1>
            <div className="title-underline"></div>
          </div>
          {selectedCategory !== 'Completed!' && selectedCategory !== 'Categories' && (
            <div className="header-actions">
              <button 
                className="ai-task-btn"
                onClick={() => setIsAIModalOpen(true)}
                title="Generate tasks with AI"
              >
                <span className="ai-icon">🤖</span>
              </button>
              <button 
                className="add-task-btn"
                onClick={() => setIsAddModalOpen(true)}
                title="Add new task manually"
              >
                <span className="plus-icon">+</span>
              </button>
            </div>
          )}
        </div>

        {renderMainContent()}
      </div>

      {isAddModalOpen && (
        <AddTaskModal 
          onAddTask={addTask}
          onClose={() => setIsAddModalOpen(false)}
          existingTasks={tasks}
        />
      )}

      {isAIModalOpen && (
        <AITaskGenerator 
          onGenerateTasks={addMultipleTasks}
          onClose={() => setIsAIModalOpen(false)}
        />
      )}
    </div>
  );
}