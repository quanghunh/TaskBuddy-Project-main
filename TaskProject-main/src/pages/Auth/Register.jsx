 import React, { useState } from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';
import './Auth.css';

export default function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email === formData.email);

      if (existingUser) {
        setErrors({ submit: 'User with this email already exists' });
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      onRegister(newUser);
      setIsLoading(false);
    }, 1000);
  };

  const registerFields = [
    {
      name: 'fullName',
      type: 'text',
      placeholder: 'Enter your full name',
      label: 'Full Name',
      value: formData.fullName,
      error: errors.fullName
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      label: 'Email Address',
      value: formData.email,
      error: errors.email
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Create a password',
      label: 'Password',
      value: formData.password,
      error: errors.password
    },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm your password',
      label: 'Confirm Password',
      value: formData.confirmPassword,
      error: errors.confirmPassword
    }
  ];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join TaskBuddy to organize your tasks</p>
        </div>

        <AuthForm
          fields={registerFields}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          submitText={isLoading ? 'Creating Account...' : 'Create Account'}
          isLoading={isLoading}
          submitError={errors.submit}
        />

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button 
              className="link-button"
              onClick={onSwitchToLogin}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
