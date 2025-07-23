import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { getProfile } from './redux/authSlice';
import socketClient from './sockets/socketClient';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import Profile from './pages/Profile';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token, isLoading } = useSelector((state: RootState) => state.auth as {
    isAuthenticated: boolean;
    token: string | null;
    isLoading: boolean;
  });

  useEffect(() => {
    // If we have a token, verify it by getting the profile
    if (token && !isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, token, isAuthenticated]);

  useEffect(() => {
    // Connect to socket when authenticated
    if (isAuthenticated && token) {
      socketClient.connect(token);
    } else {
      socketClient.disconnect();
    }

    return () => {
      socketClient.disconnect();
    };
  }, [isAuthenticated, token]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AdminLogin />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/project/:id" 
          element={
            <ProtectedRoute>
              <ProjectBoard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </div>
  );
}

export default App;
