import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    login_id: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await signup({
        name: formData.name,
        login_id: formData.login_id,
        password: formData.password,
      });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-secondary-200 my-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6 no-underline">
            <Logo />
          </Link>
          <h2 className="text-3xl font-display font-bold text-secondary-900">
            Create account
          </h2>
          <p className="mt-2 text-sm text-secondary-500">
            Join us to get started with your journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}



                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  variant="outlined"
                  required
                  slotProps={{
                  input: {
                    startAdornment: <User size={20} className="mr-2 text-secondary-400" />,
                  },
                  }}
                />

                <TextField
                  fullWidth
                  label="Login ID"
                  name="login_id"
                  type="text"
                  value={formData.login_id}
                  onChange={handleChange}
                  placeholder="your_login_id"
                  variant="outlined"
                  required
                  slotProps={{
                  input: {
                    startAdornment: <User size={20} className="mr-2 text-secondary-400" />,
                  },
                  }}
                />

                {/* Only name, login_id, password, confirmPassword fields are used as per new requirements */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              variant="outlined"
              required
              slotProps={{
                input: {
                  startAdornment: <Lock size={20} className="mr-2 text-secondary-400" />,
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              variant="outlined"
              required
              slotProps={{
                input: {
                  startAdornment: <Lock size={20} className="mr-2 text-secondary-400" />,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, mt: 1 }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </Box>
        </form>

        <div className="text-center">
          <p className="text-sm text-secondary-500 ">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;