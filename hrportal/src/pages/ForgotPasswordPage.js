import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api/api';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { forgotPassword, resetPassword } = useAuth();

    // Step 1: Request the OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const data = await forgotPassword(email);
            setMessage(data.message);
            setOtpSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
        setLoading(false);
    };

    // Step 2: Submit OTP and new password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const data = await resetPassword(email, otp, password);
            setMessage(data.message + " You can now log in with your new password.");
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center py-12">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
                {message && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">{message}</p>}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                
                {!otpSent ? (
                    // --- View 1: Email Form ---
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                        <p className="text-center text-sm text-gray-600">Enter your email to receive a password reset OTP.</p>
                        <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                            {loading ? <Spinner /> : 'Send OTP'}
                        </Button>
                    </form>
                ) : (
                    // --- View 2: OTP and New Password Form ---
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <Input id="otp" label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        <Input id="password" label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                            {loading ? <Spinner /> : 'Reset Password'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;