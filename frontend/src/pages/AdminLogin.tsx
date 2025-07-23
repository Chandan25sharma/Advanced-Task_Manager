import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RootState, AppDispatch } from '../redux/store';
import { login } from '../redux/authSlice';
import { LoginCredentials } from '../api/auth';

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth as {
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  });
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      console.log('🔐 Admin login form submit:', data);
      const result = await dispatch(login(data));
      console.log('🔐 Admin login result:', result);
      
      if (login.fulfilled.match(result)) {
        console.log('✅ Login successful, payload:', result.payload);
        toast.success('Welcome back, Admin!');
      } else {
        console.log('❌ Login failed, payload:', result.payload);
        toast.error(result.payload as string || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDemoLogin = async (userType: 'admin' | 'demo') => {
    const credentials = userType === 'admin' 
      ? { email: 'admin@taskmanager.com', password: 'Admin123!' }
      : { email: 'demo@taskmanager.com', password: 'Demo123!' };
    
    try {
      console.log(`🔐 Demo ${userType} login:`, credentials);
      const result = await dispatch(login(credentials));
      console.log(`🔐 Demo ${userType} result:`, result);
      
      if (login.fulfilled.match(result)) {
        console.log(`✅ ${userType} login successful:`, result.payload);
        toast.success(`Welcome, ${userType}!`);
      } else {
        console.log(`❌ ${userType} login failed:`, result.payload);
        toast.error(result.payload as string || 'Login failed');
      }
    } catch (error) {
      console.error(`❌ ${userType} login error:`, error);
      toast.error('An unexpected error occurred');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Demo Login Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              🔐 Login as Admin (Demo)
            </button>
            <button
              onClick={() => handleDemoLogin('demo')}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              👤 Login as Demo User
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in manually</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="mt-1 input"
                placeholder="admin@taskmanager.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                type={showPassword ? 'text' : 'password'}
                className="mt-1 input pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Demo Credentials:</strong></p>
              <p>Admin: admin@taskmanager.com / Admin123!</p>
              <p>User: demo@taskmanager.com / Demo123!</p>
            </div>
            <div className="mt-4">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                ← Back to regular login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
