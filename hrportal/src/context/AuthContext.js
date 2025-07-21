// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

console.log("API Base URL:", process.env.REACT_APP_API_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, role) => {
    const url = role === 'hr' ? '/auth/login/hr' : '/auth/login/employee';
    const { data } = await api.post(url, { email, password });
    if (data) {
      const userData = { ...data, role };
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
    }
  };

  // --- NEW OTP REGISTRATION FUNCTIONS ---
  const requestRegistrationOtp = async (userData) => {
    // This just sends the request, doesn't log the user in
    const { data } = await api.post('/auth/register/request-otp', userData);
    return data; // Return the success message
  };

  const verifyAndRegister = async (email, otp) => {
    const { data } = await api.post('/auth/register/verify', { email, otp });
    if (data) {
      const newUserData = { ...data, role: 'employee' };
      localStorage.setItem('userInfo', JSON.stringify(newUserData));
      setUser(newUserData);
    }
  };

  // --- NEW OTP PASSWORD RESET FUNCTIONS ---
  const forgotPassword = async (email) => {
    const { data } = await api.post('/auth/forgotpassword', { email });
    return data;
  };

  const resetPassword = async (email, otp, password) => {
    const { data } = await api.put('/auth/resetpassword', { email, otp, password });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    requestRegistrationOtp, // New
    verifyAndRegister,      // New
    forgotPassword,         // Updated
    resetPassword,          // Updated
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
