// src/components/layout/Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      {/* You could add a footer here if needed */}
    </div>
  );
};

export default Layout;