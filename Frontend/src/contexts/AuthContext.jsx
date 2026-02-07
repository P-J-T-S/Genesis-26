import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import { mockUsers } from '../data/demoData';

const AuthContext = createContext(null);

export const ROLES = {
  CITY_HEAD: 'CITY_HEAD',
  WARD_OFFICER: 'WARD_OFFICER',
  ZONAL_SUPERVISOR: 'ZONAL_SUPERVISOR',
  MANAGER: 'MANAGER',
  TECHNICIAN: 'TECHNICIAN',
  USER: 'USER',
};

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

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token by fetching current user
          const response = await userAPI.getCurrentUser();
          const userData = response.data.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);


  const login = async (email, password) => {
    try {
      // Check for mock user login (Demo Mode)
      const mockUser = mockUsers.find(u => u.email === email);
      if (mockUser) {
        // Simulate API response structure
        const userData = mockUser;
        localStorage.setItem('accessToken', 'mock-token-' + userData.id);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }

      const response = await authAPI.login(email, password);
      const { accessToken, user: userData } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };


  const signup = async (data) => {
    try {
      // data: { username, email, fullName, password, role }
      const response = await authAPI.signup(data);
      const userData = response.data.data;

      // After signup, auto login
      const loginResult = await login(data.email, data.password);
      return loginResult;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      return { success: false, error: message };
    }
  };


  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };


  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    isCityHead: user?.role === 'CITY_HEAD',
    isWardOfficer: user?.role === 'WARD_OFFICER',
    isZonalSupervisor: user?.role === 'ZONAL_SUPERVISOR',
    isAdmin: user?.role === 'CITY_HEAD', // Mapping City Head to Admin for backward compatibility if needed
    isManager: user?.role === 'MANAGER',
    isTechnician: user?.role === 'TECHNICIAN',
    isUser: user?.role === 'USER',
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};