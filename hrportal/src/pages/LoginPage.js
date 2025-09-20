

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const deviceInfo = role === 'employee' ? navigator.userAgent : undefined;
      await login(email, password, role, deviceInfo);
      navigate(role === 'hr' ? '/hr/dashboard' : '/employee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex justify-center items-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl px-8 py-10 animate-fade-in-down">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-wide">Welcome Back</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}

        <div className="mb-5 flex justify-center border border-gray-300 rounded-md p-1">
          {['employee', 'hr'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`w-1/2 py-2 transition duration-300 rounded-md text-sm font-medium ${
                role === r ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {r === 'employee' ? 'Employee' : 'HR Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline transition">Forgot password?</Link>
          </div>
          <Button type="submit" variant="primary" className="w-full hover:scale-[1.02] transition-transform" disabled={loading}>
            {loading ? <Spinner /> : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">Register here</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
