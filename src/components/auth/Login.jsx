import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, Crown, Gem } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-cream-100 to-white flex items-center justify-center p-4">
      {/* Elegant Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-yellow-100/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-100/10 to-yellow-50/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        
        <div className="absolute top-0 left-0 w-64 h-64 border-t border-l border-amber-200/10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 border-b border-r border-amber-200/10"></div>
        

        <div className="absolute top-1/4 left-10 w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
        <div className="absolute bottom-1/4 right-10 w-24 h-0.5 bg-gradient-to-l from-transparent via-amber-400/20 to-transparent"></div>
      </div>


      <div className="relative w-full max-w-md z-10">
        {/* Luxurious Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 animate-fade-in">
          {/* Logo/Brand Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl shadow-lg mb-6 border border-amber-200/50">
              <div className="relative">
                <LogIn className="w-10 h-10 text-amber-700" />
                {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div> */}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 font-light">
              Sign in to your <span className="font-semibold text-amber-600">2-Hand Stuff</span> account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-yellow-50/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-200/30 transition-all duration-300 shadow-sm">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                    placeholder="you@university.edu"
                  />
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 bg-red-50/80 px-3 py-2 rounded-lg border border-red-200">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-200/30 transition-all duration-300 shadow-sm">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-amber-500 hover:text-amber-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-amber-500 hover:text-amber-600" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 bg-red-50/80 px-3 py-2 rounded-lg border border-red-200">
                  {errors.password.message}
                </p>
              )}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3.5 px-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </div>
            </button>

            
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-amber-100 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-semibold text-amber-600 hover:text-amber-700 hover:underline underline-offset-2 transition-all duration-200"
              >
                Create one now
              </button>
            </p>
            <p className="text-xs text-gray-400 mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;