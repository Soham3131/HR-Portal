// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import MotivationalQuotes from '../components/MotivationalQuotes';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Welcome to the <span className="text-blue-600">AVANI ENTERPRISES</span> HR Portal</h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Your one-stop solution for managing employee data, attendance, and daily reports efficiently.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        {user ? (
          <Link to={user.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard'}>
            <Button variant="primary" className="text-lg">Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button variant="primary" className="text-lg">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="text-lg">Register</Button>
            </Link>
          </>
        )}
      </div>
      
    </div>
  );
};

export default HomePage;