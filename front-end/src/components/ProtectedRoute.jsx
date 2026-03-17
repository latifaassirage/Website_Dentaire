import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  console.log('ProtectedRoute check:', {
    loading,
    authenticated: isAuthenticated(),
    userRole,
    allowedRole
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#00a896'
      }}>
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    console.log('Role mismatch, redirecting. userRole:', userRole, 'allowedRole:', allowedRole);
    // Redirect to appropriate dashboard based on role
    const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/patient/dashboard';
    console.log('Redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('Access granted for role:', userRole);
  return children;
};

export default ProtectedRoute;
