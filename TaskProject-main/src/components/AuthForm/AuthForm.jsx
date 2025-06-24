 import React, { useState } from 'react';
import './AuthForm.css';

export default function AuthForm({ 
  fields, 
  onInputChange, 
  onSubmit, 
  submitText, 
  isLoading, 
  submitError 
}) {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      {fields.map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name} className="form-label">
            {field.label}
          </label>
          <div className="input-container">
            <input
              type={field.type === 'password' && showPasswords[field.name] ? 'text' : field.type}
              id={field.name}
              name={field.name}
              value={field.value}
              onChange={onInputChange}
              placeholder={field.placeholder}
              className={`form-input ${field.error ? 'error' : ''}`}
              disabled={isLoading}
            />
            {field.type === 'password' && (
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility(field.name)}
                disabled={isLoading}
              >
                {showPasswords[field.name] ? '👁️' : '👁️‍🗨️'}
              </button>
            )}
          </div>
          {field.error && (
            <span className="error-message">{field.error}</span>
          )}
        </div>
      ))}

      {submitError && (
        <div className="submit-error">
          <span className="error-message">{submitError}</span>
        </div>
      )}

      <button
        type="submit"
        className={`submit-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading && <span className="spinner"></span>}
        {submitText}
      </button>
    </form>
  );
}
