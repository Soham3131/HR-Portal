

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: '', otherDepartment: '', phone: '', address: '', dob: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { requestRegistrationOtp, verifyAndRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true); setError(''); setMessage('');
    try {
      const registrationData = {
        ...formData,
        department: formData.department === 'Other' ? formData.otherDepartment : formData.department,
      };
      const data = await requestRegistrationOtp(registrationData);
      setMessage(data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    }
    setLoading(false);
  };

  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     await verifyAndRegister(formData.email, otp);
  //     navigate('/employee/dashboard');
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Verification failed.');
  //   }
  //   setLoading(false);
  // };

  const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    await verifyAndRegister(cleanEmail, cleanOtp);
    navigate('/employee/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Verification failed.');
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl px-10 py-10 animate-fade-in-up">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
        {message && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">{message}</p>}

        {!otpSent ? (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-wide">Create Employee Account</h2>
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <Input id="name" name="name" label="Full Name" value={formData.name} onChange={handleChange} required />
              <Input id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Department</option>
                  <option value="Technology">Technology</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="TeamLeadIT">TeamLeadIT</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.department === 'Other' && (
                <Input id="otherDepartment" name="otherDepartment" label="Please specify" value={formData.otherDepartment} onChange={handleChange} required />
              )}

              <Input id="phone" name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} />
              <Input id="address" name="address" label="Address" value={formData.address} onChange={handleChange} />
              <Input id="dob" name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} />
              <Input id="password" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
              <Input id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} required />

              <Button type="submit" variant="primary" className="w-full hover:scale-[1.02] transition-transform" disabled={loading}>
                {loading ? <Spinner /> : 'Send OTP'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-wide">Verify Email</h2>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input id="otp" name="otp" label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              <Button type="submit" variant="primary" className="w-full hover:scale-[1.02]" disabled={loading}>
                {loading ? <Spinner /> : 'Verify & Register'}
              </Button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">Login here</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
