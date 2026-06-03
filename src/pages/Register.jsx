import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../auth/authService';
import './Auth.css';

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
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

    const result = registerUser(formData);

    if (result.success) {

      navigate('/login');

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

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Register to start using CourseFinder™
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

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
          Register
        </button>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}