import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { validateEmail, validatePassword } from '../../utils/helpers';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const user = await login(formData.email, formData.password);
      
      // Redirect based on role
      switch (user.role) {
        case 'customer':
          navigate('/customer/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'delivery':
          navigate('/delivery/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">🍔 Feasto</h1>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {apiError}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="customer@feasto.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Demo Accounts:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>👤 Customer: customer@feasto.com / customer123</p>
              <p>👑 Admin: admin@feasto.com / admin123</p>
              <p>🚚 Delivery: delivery@feasto.com / delivery123</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
