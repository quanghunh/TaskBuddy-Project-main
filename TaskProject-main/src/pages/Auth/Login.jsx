 import React, { useState } from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';
import './Auth.css';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check stored users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      } else {
        setErrors({ submit: 'Invalid email or password' });
      }
      setIsLoading(false);
    }, 1000);
  };

  const loginFields = [
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
      placeholder: 'Enter your password',
      label: 'Password',
      value: formData.password,
      error: errors.password
    }
  ];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <AuthForm
          fields={loginFields}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          submitText={isLoading ? 'Signing in...' : 'Sign In'}
          isLoading={isLoading}
          submitError={errors.submit}
        />

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button 
              className="link-button"
              onClick={onSwitchToRegister}
            >
              Sign up here
            </button>
          </p>
        </div>

        <div className="demo-credentials">
          <h4>Demo Account:</h4>
          <p>Email: demo@example.com</p>
          <p>Password: 123456</p>
          <button 
            className="demo-login-btn"
            onClick={() => {
              setFormData({
                email: 'demo@example.com',
                password: '123456'
              });
            }}
          >
            Use Demo Account
          </button>
        </div>
      </div>
    </div>
  );
}
