import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { register, handleSubmit } = useForm({ defaultValues: { baseCurrency: 'USD' } });
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync, isLoading, error } = useMutation({ mutationFn: signup });

  const onSubmit = async (values) => {
    try {
      const res = await mutateAsync(values);
      setAuth(res.user, res.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12" style={{ backgroundColor: '#3d4a1f' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-[#c4ff61] rounded-lg flex items-center justify-center">
              <span className="text-[#3d4a1f] font-bold text-2xl">E</span>
            </div>
            <span className="text-white text-2xl font-semibold">Expense Manager</span>
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Get Started</h1>
          <p className="text-gray-400">Create your company account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#5a6b35] focus:border-transparent outline-none transition" 
                placeholder="John Doe" 
                {...register('name')} 
              />
            </div>
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
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">Company Information</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#5a6b35] focus:border-transparent outline-none transition" 
                    placeholder="Acme Corp" 
                    {...register('companyName')} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Currency</label>
                  <select 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#5a6b35] focus:border-transparent outline-none transition" 
                    {...register('baseCurrency')}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error?.response?.data?.message || error?.message || 'Signup failed. Please try again.'}
              </div>
            )}
            <button 
              className="w-full py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
              style={{ backgroundColor: '#5a6b35', color: 'white' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-medium hover:underline" style={{ color: '#5a6b35' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
