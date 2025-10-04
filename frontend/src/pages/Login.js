import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync, isLoading, error } = useMutation({ mutationFn: login });

  const onSubmit = async (values) => {
    const res = await mutateAsync(values);
    setAuth(res.user, res.token);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#3d4a1f' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-[#c4ff61] rounded-lg flex items-center justify-center">
              <span className="text-[#3d4a1f] font-bold text-2xl">E</span>
            </div>
            <span className="text-white text-2xl font-semibold">Expense Manager</span>
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#5a6b35] focus:border-transparent outline-none transition" 
                placeholder="you@company.com" 
                type="email" 
                {...register('email')} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#5a6b35] focus:border-transparent outline-none transition" 
                placeholder="••••••••" 
                type="password" 
                {...register('password')} 
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error.message}
              </div>
            )}
            <button 
              className="w-full py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
              style={{ backgroundColor: '#5a6b35', color: 'white' }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium hover:underline" style={{ color: '#5a6b35' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
