// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import Layout from './components/Layout';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
             <ThemeProvider attribute="class"><AppRouter /></ThemeProvider>
          
          
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
