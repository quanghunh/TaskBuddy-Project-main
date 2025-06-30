 import React, { useState } from 'react';
import './AITaskGenerator.css';

export default function AITaskGenerator({ onGenerateTasks, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const examplePrompts = [
    "Create a morning routine checklist with 5 tasks",
    "Plan a weekend trip to Dalat with 8 essential tasks",
    "Organize my workspace with 6 productivity tasks",
    "Prepare for a job interview with 7 preparation tasks",
    "Learn React.js in 2 weeks with daily tasks"
  ];

  const handleGenerateTasks = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI task generation (replace with actual AI API later)
    setTimeout(() => {
      const mockTasks = generateMockTasks(prompt);
      setGeneratedTasks(mockTasks);
      setShowPreview(true);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockTasks = (userPrompt) => {
    // Mock task generation based on prompt keywords
    const lowercasePrompt = userPrompt.toLowerCase();
    let tasks = [];

    if (lowercasePrompt.includes('morning routine')) {
      tasks = [
        { title: 'Drink a glass of water', description: 'Start your day with hydration', priority: 'High', category: 'Health' },
        { title: 'Do 10 minutes of stretching', description: 'Wake up your body with gentle stretches', priority: 'Medium', category: 'Health' },
        { title: 'Review daily goals', description: 'Check your agenda and priorities for today', priority: 'High', category: 'Personal' },
        { title: 'Eat a healthy breakfast', description: 'Fuel your body with nutritious food', priority: 'High', category: 'Health' },
        { title: 'Meditate for 5 minutes', description: 'Center your mind before starting the day', priority: 'Medium', category: 'Personal' }
      ];
    } else if (lowercasePrompt.includes('trip') || lowercasePrompt.includes('travel')) {
      tasks = [
        { title: 'Book accommodation', description: 'Reserve hotel or homestay for your trip', priority: 'High', category: 'Personal' },
        { title: 'Plan transportation', description: 'Book flights, trains, or rental car', priority: 'High', category: 'Personal' },
        { title: 'Create itinerary', description: 'List places to visit and activities', priority: 'Medium', category: 'Personal' },
        { title: 'Pack essentials', description: 'Prepare clothes and necessary items', priority: 'Medium', category: 'Personal' },
        { title: 'Check weather forecast', description: 'Plan appropriate clothing', priority: 'Low', category: 'Personal' },
        { title: 'Notify bank of travel', description: 'Inform bank to avoid card blocks', priority: 'Medium', category: 'Personal' },
        { title: 'Download offline maps', description: 'Prepare for areas with poor signal', priority: 'Low', category: 'Personal' },
        { title: 'Set auto-reply emails', description: 'Let colleagues know you are away', priority: 'Low', category: 'Work' }
      ];
    } else if (lowercasePrompt.includes('workspace') || lowercasePrompt.includes('organize')) {
      tasks = [
        { title: 'Clear desk surface', description: 'Remove unnecessary items from workspace', priority: 'High', category: 'Work' },
        { title: 'Organize digital files', description: 'Sort and categorize computer files', priority: 'Medium', category: 'Work' },
        { title: 'Set up task management system', description: 'Choose and configure productivity tools', priority: 'High', category: 'Work' },
        { title: 'Create filing system', description: 'Organize physical documents', priority: 'Medium', category: 'Work' },
        { title: 'Optimize lighting', description: 'Adjust desk lamp and monitor brightness', priority: 'Low', category: 'Work' },
        { title: 'Add productivity tools', description: 'Get necessary stationery and organizers', priority: 'Low', category: 'Work' }
      ];
    } else if (lowercasePrompt.includes('interview')) {
      tasks = [
        { title: 'Research the company', description: 'Study company history, values, and recent news', priority: 'High', category: 'Work' },
        { title: 'Practice common questions', description: 'Prepare answers for typical interview questions', priority: 'High', category: 'Work' },
        { title: 'Prepare questions to ask', description: 'Think of insightful questions about the role', priority: 'Medium', category: 'Work' },
        { title: 'Choose interview outfit', description: 'Select appropriate professional attire', priority: 'Medium', category: 'Work' },
        { title: 'Update portfolio/resume', description: 'Ensure all materials are current', priority: 'High', category: 'Work' },
        { title: 'Plan route to interview', description: 'Check directions and travel time', priority: 'Medium', category: 'Work' },
        { title: 'Practice mock interview', description: 'Do practice session with friend or mirror', priority: 'High', category: 'Work' }
      ];
    } else {
      // Generic tasks based on prompt
      const taskCount = Math.floor(Math.random() * 5) + 3; // 3-7 tasks
      for (let i = 1; i <= taskCount; i++) {
        tasks.push({
          title: `Task ${i} for: ${userPrompt}`,
          description: `Complete this task as part of your goal: ${userPrompt}`,
          priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
          category: ['General', 'Work', 'Personal'][Math.floor(Math.random() * 3)]
        });
      }
    }

    return tasks;
  };

  const handleConfirmTasks = () => {
    onGenerateTasks(generatedTasks);
    onClose();
  };

  const handleEditTask = (index, field, value) => {
    const updatedTasks = [...generatedTasks];
    updatedTasks[index][field] = value;
    setGeneratedTasks(updatedTasks);
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = generatedTasks.filter((_, i) => i !== index);
    setGeneratedTasks(updatedTasks);
  };

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <div className="ai-header-title">
            <h2>🤖 AI Task Generator</h2>
            <p>Describe what you want to accomplish and I'll create tasks for you</p>
          </div>
          <button className="ai-close-btn" onClick={onClose}>×</button>
        </div>

        {!showPreview ? (
          <div className="ai-generator-form">
            <div className="ai-form-group">
              <label htmlFor="ai-prompt">What would you like to accomplish?</label>
              <textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a morning routine, Plan a weekend trip to Dalat, Organize my workspace..."
                rows="4"
                className="ai-prompt-input"
              />
            </div>

            <div className="ai-examples">
              <h4>💡 Try these examples:</h4>
              <div className="ai-example-list">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    className="ai-example-btn"
                    onClick={() => setPrompt(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="ai-form-actions">
              <button 
                className="ai-cancel-btn" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className={`ai-generate-btn ${isGenerating ? 'generating' : ''}`}
                onClick={handleGenerateTasks}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating && <span className="ai-spinner"></span>}
                {isGenerating ? 'Generating Tasks...' : '✨ Generate Tasks'}
              </button>
            </div>
          </div>
        ) : (
          <div className="ai-preview-section">
            <div className="ai-preview-header">
              <h3>📋 Generated Tasks ({generatedTasks.length})</h3>
              <p>Review and edit the tasks before adding them to your list</p>
            </div>

            <div className="ai-task-list">
              {generatedTasks.map((task, index) => (
                <div key={index} className="ai-task-item">
                  <div className="ai-task-number">{index + 1}</div>
                  <div className="ai-task-content">
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleEditTask(index, 'title', e.target.value)}
                      className="ai-task-title-input"
                    />
                    <textarea
                      value={task.description}
                      onChange={(e) => handleEditTask(index, 'description', e.target.value)}
                      className="ai-task-desc-input"
                      rows="2"
                    />
                    <div className="ai-task-meta">
                      <select
                        value={task.priority}
                        onChange={(e) => handleEditTask(index, 'priority', e.target.value)}
                        className="ai-task-select"
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                      <select
                        value={task.category}
                        onChange={(e) => handleEditTask(index, 'category', e.target.value)}
                        className="ai-task-select"
                      >
                        <option value="General">General</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Health">Health</option>
                        <option value="Learning">Learning</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    className="ai-remove-task-btn"
                    onClick={() => handleRemoveTask(index)}
                    title="Remove task"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="ai-preview-actions">
              <button 
                className="ai-back-btn" 
                onClick={() => {
                  setShowPreview(false);
                  setGeneratedTasks([]);
                }}
              >
                ← Back to Edit
              </button>
              <button 
                className="ai-confirm-btn"
                onClick={handleConfirmTasks}
                disabled={generatedTasks.length === 0}
              >
                ✅ Add All Tasks ({generatedTasks.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
