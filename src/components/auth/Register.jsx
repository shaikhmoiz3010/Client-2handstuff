import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, GraduationCap, Eye, EyeOff, BookOpen, ShoppingBag, Users, Sparkles, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  university: z.string().optional(),
  location: z.string().min(2, 'Please enter your location'),
  isSeller: z.boolean().default(false)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const isSeller = watch('isSeller');

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-cream-100 to-white py-12 px-4 sm:px-6 lg:px-8">


      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden"
        >
          <div className="md:flex">
            {/* Left Side - Form */}
            <div className="md:w-2/3 p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl shadow-lg mb-4 border border-amber-200/50">
                  <BookOpen className="w-10 h-10 text-amber-700" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800">Join <span className="font-bold text-amber-600">2-Hand Stuff</span></h1>
                <p className="text-gray-600 mt-2">Start your academic journey with us</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                      <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-200/30 transition-all duration-300 shadow-sm">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
                          {...register('name')}
                          type="text"
                          className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                          placeholder="Enter your Name"
                        />
                      </div>
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50/80 px-3 py-2 rounded-lg border border-red-200">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
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
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                      Password *
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

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                      Confirm Password *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                      <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-200/30 transition-all duration-300 shadow-sm">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
                          {...register('confirmPassword')}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full pl-12 pr-12 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5 text-amber-500 hover:text-amber-600" />
                          ) : (
                            <Eye className="w-5 h-5 text-amber-500 hover:text-amber-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50/80 px-3 py-2 rounded-lg border border-red-200">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                      <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-200/30 transition-all duration-300 shadow-sm">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
                          {...register('phone')}
                          type="tel"
                          className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                          placeholder="+91 999999999"
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50/80 px-3 py-2 rounded-lg border border-red-200">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                      Location *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                      <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-200/30 transition-all duration-300 shadow-sm">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
                          {...register('location')}
                          type="text"
                          className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                    {errors.location && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50/80 px-3 py-2 rounded-lg border border-red-200">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* University */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    University/Institution
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-200/30 transition-all duration-300 shadow-sm">
                      <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                      <input
                        {...register('university')}
                        type="text"
                        className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                        placeholder="University Name"
                      />
                    </div>
                  </div>
                </div>

                {/* Seller Option */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50/30 rounded-xl border border-amber-200/30">
                  <div className="flex items-center">
                    <input
                      {...register('isSeller')}
                      type="checkbox"
                      className="h-5 w-5 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      I want to sell items on StudyMart
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Seller Account
                      </span>
                    </label>
                  </div>
                  
                  {isSeller && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="p-3 bg-white/50 rounded-lg border border-amber-200/50">
                        <p className="text-sm text-amber-800">
                          <span className="font-semibold">Seller Benefits:</span> List study materials, set your prices, 
                          and connect with buyers. Student verification required.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Terms */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50/30 rounded-xl border border-amber-200/30">
                  <div className="flex items-start">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="h-5 w-5 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500 focus:ring-2 mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="font-semibold text-amber-600 hover:text-amber-700 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="font-semibold text-amber-600 hover:text-amber-700 hover:underline">
                        Privacy Policy
                      </Link>
                      <span className="block text-xs text-gray-500 mt-1">
                        By creating an account, you agree to our community guidelines and policies.
                      </span>
                    </label>
                  </div>
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
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        <span>Join StudyMart</span>
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 pt-6 border-t border-amber-100 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-amber-600 hover:text-amber-700 hover:underline underline-offset-2 transition-all duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="md:w-1/3 bg-gradient-to-b from-amber-600 to-amber-700 text-white p-8 md:p-10 flex flex-col justify-center relative overflow-hidden">
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/10"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Why Join StudyMart?</h2>
                  <p className="text-amber-100 mt-2">Discover the benefits of our academic community</p>
                </div>

                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Smart Savings</h3>
                      <p className="text-amber-100 text-sm">
                        Get textbooks and study materials at up to 70% off retail prices
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Earn Money</h3>
                      <p className="text-amber-100 text-sm">
                        Turn your old study materials into cash with our easy listing process
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Campus Network</h3>
                      <p className="text-amber-100 text-sm">
                        Connect with verified students from universities nationwide
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Verified Quality</h3>
                      <p className="text-amber-100 text-sm">
                        All materials are quality-checked by our student verification team
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Stats */}
                {/* <div className="mt-8 pt-6 border-t border-amber-500/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">10K+</div>
                      <div className="text-sm text-amber-200">Active Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">5K+</div>
                      <div className="text-sm text-amber-200">Study Materials</div>
                    </div>
                  </div>
                </div> */}

                {/* Testimonial */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link to="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;