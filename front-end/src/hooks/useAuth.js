import React, { useState, useEffect, useContext, createContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      const storedUserName = localStorage.getItem('userName');
      
      console.log('useAuth init:', { storedRole, storedUserId, storedUserName });
      
      if (storedRole) {
        setUserRole(storedRole);
        setUser({ role: storedRole, user_id: storedUserId, name: storedUserName, id: storedUserId });
        console.log('useAuth - user set:', { role: storedRole, user_id: storedUserId, name: storedUserName, id: storedUserId });
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('useAuth login attempt:', credentials);
      const response = await authAPI.login(credentials);
      const { success, role, user_id, name, token } = response.data;
      
      console.log('useAuth login response:', { success, role, user_id, name, token });
      
      if (success) {
        // Store the token for API authentication
        if (token) {
          localStorage.setItem('token', token);
          setToken(token);
        }
        
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', user_id);
        localStorage.setItem('userName', name);
        setUserRole(role);
        setUser({ role, user_id, name, id: user_id });
        
        console.log('useAuth login - state updated:', { role, user_id, name, token, id: user_id });
        
        return { success: true, role };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { success, role } = response.data;
      
      if (success) {
        return { success: true, role };
      }
      
      return { success: false, error: response.data?.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setToken(null);
    setUserRole(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    const result = !!userRole;
    console.log('isAuthenticated check:', { userRole, result });
    return result;
  };

  const isAdmin = () => {
    return userRole === 'admin';
  };

  const isPatient = () => {
    return userRole === 'patient';
  };

  const value = {
    user,
    token,
    userRole,
    loading,
    isAuthenticated,
    isAdmin,
    isPatient,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
