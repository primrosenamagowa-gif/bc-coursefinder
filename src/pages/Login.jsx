import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../auth/authService';
import './Auth.css';

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const result = loginUser(
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >

        <div className="auth-logo">
          <span>BC</span>
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to continue using CourseFinder™
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

        <p className="auth-switch">
          Don't have an account?
          <Link to="/register">
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}