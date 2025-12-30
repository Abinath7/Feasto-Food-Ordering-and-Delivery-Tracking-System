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
    <div
      
  className="min-h-screen flex items-center justify-center bg-no-repeat bg-contain bg-center relative"
 


      style={{ backgroundImage: "url('/feasto1.avif')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-red-600 mb-1">🍔 Feasto</h1>
          <p className="text-sm text-gray-200">Fast • Fresh • Delivered</p>
          <h2 className="mt-4 text-2xl font-bold text-white">
            Login to your account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Or{' '}
            <Link
              to="/register"
              className="text-red-400 hover:text-red-300 font-medium"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Card */}
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

            <div className="flex justify-end text-sm">
              <Link
                to="/forgot-password"
                className="text-red-600 hover:text-red-700"
              >
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
            <p>Customer: customer@feasto.com</p>
            <p>Admin: admin@feasto.com</p>
            <p>Delivery: delivery@feasto.com</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
