import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import './index.css';
import './styles/global.css';

import App from './App.jsx';

import Login from './pages/Login';
import Register from './pages/Register';

import ProtectedRoute from './routes/ProtectedRoute';

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>

    </BrowserRouter>

  </React.StrictMode>
);
