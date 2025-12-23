import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import authService from '../../services/authService';
import { validateEmail } from '../../utils/helpers';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <Card>
          {success ? (
            <div>
              <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Password reset link has been sent to your email!
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Please check your email and follow the instructions to reset your password.
              </p>
              <Link to="/login">
                <Button fullWidth>Return to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                error={error}
                placeholder="your@email.com"
                required
              />

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
