import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, GraduationCap,
  Camera, Save, Shield, Edit2, ShoppingBag,
  Star, Calendar, Eye, Package, Heart,
  Sparkles, Award, TrendingUp, Zap,
  ExternalLink, Bell, CreditCard, Settings,
  LogOut, Users, BookOpen, IndianRupee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: user || {}
  });

  useEffect(() => {
    fetchUserStats();
    fetchRecentProducts();
    fetchWishlistCount();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/users/dashboard');
      setStats(response.data.data.dashboardStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchRecentProducts = async () => {
    try {
      const response = await api.get('/products/user/my-products?limit=3');
      setRecentProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlistCount(response.data.data.wishlist?.length || 0);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await updateProfile(data);
      if (result.success) {
        setIsEditing(false);
        reset(data);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      await api.patch('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600">Manage your account and activities</p>
            </div>
            <div className="flex items-center space-x-3">
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card - Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 border border-white/60"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div className="flex items-center space-x-4 mb-6 md:mb-0">
                    <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-amber-500 border-2 border-amber-200 shadow-sm">
                      <span className="text-lg font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2.5 border-2 border-amber-500 text-amber-700 hover:bg-amber-50 rounded-xl font-semibold transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-1">
                  {['overview', 'listings', 'wishlist'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab
                          ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('name', { required: 'Name is required' })}
                          type="text"
                          className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Invalid email address'
                            }
                          })}
                          type="email"
                          className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('phone')}
                          type="tel"
                          className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('location', { required: 'Location is required' })}
                          type="text"
                          className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        />
                      </div>
                      {errors.location && (
                        <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      University/Institution
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('university')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          {...register('isSeller')}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Enable Seller Account
                      </span>
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t border-amber-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white py-3.5 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Overview Content */}
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                        <Mail className="w-6 h-6 text-amber-600" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-bold text-gray-800">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                        <Phone className="w-6 h-6 text-amber-600" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-bold text-gray-800">{user.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                        <MapPin className="w-6 h-6 text-amber-600" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-bold text-gray-800">{user.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                        <GraduationCap className="w-6 h-6 text-amber-600" />
                        <div>
                          <p className="text-sm text-gray-500">University</p>
                          <p className="font-bold text-gray-800">{user.university || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Listings Content */}
                  {activeTab === 'listings' && (
                    <div>
                      {recentProducts.length === 0 ? (
                        <div className="text-center py-12">
                          <ShoppingBag className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-gray-800 mb-2">No Listings Yet</h3>
                          <p className="text-gray-600 mb-6">Start selling your study materials</p>
                          <Link
                            to="/create-product"
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            <ShoppingBag className="w-5 h-5" />
                            <span>List Your First Item</span>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {recentProducts.map((product) => (
                            <div key={product._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 rounded-2xl hover:shadow transition-all">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100'}
                                  alt={product.title}
                                  className="w-16 h-16 rounded-xl object-cover"
                                />
                                <div>
                                  <h4 className="font-bold text-gray-800 line-clamp-1">{product.title}</h4>
                                  <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                                    <span className="font-bold text-amber-700">₹{product.price}</span>
                                    <span className="capitalize">{product.condition}</span>
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${product.status === 'available' ? 'bg-green-100 text-green-800' :
                                        product.status === 'sold' ? 'bg-red-100 text-red-800' :
                                          'bg-yellow-100 text-yellow-800'
                                      }`}>
                                      {product.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Link
                                to={`/products/${product._id}`}
                                className="text-amber-700 hover:text-amber-900 font-medium"
                              >
                                View →
                              </Link>
                            </div>
                          ))}
                          <div className="pt-4 border-t border-amber-200">
                            <Link
                              to="/dashboard"
                              className="flex items-center justify-center space-x-2 text-amber-700 hover:text-amber-900 font-semibold"
                            >
                              <span>View All Listings</span>
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Wishlist Content */}
                  {activeTab === 'wishlist' && (
                    <div>
                      {wishlistCount === 0 ? (
                        <div className="text-center py-12">
                          <Heart className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h3>
                          <p className="text-gray-600 mb-6">Save items you love for later</p>
                          <Link
                            to="/products"
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            <ShoppingBag className="w-5 h-5" />
                            <span>Browse Products</span>
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-10 h-10 text-amber-600 fill-current" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{wishlistCount} Saved Items</h3>
                          <p className="text-gray-600 mb-6">Manage your wishlist from the dedicated page</p>
                          <Link
                            to="/wishlist"
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            <Heart className="w-5 h-5" />
                            <span>Go to Wishlist</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Stats Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 border border-white/60"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
                Your Stats Summary
              </h3>

              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                    <Package className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-800">{stats.totalProducts || 0}</p>
                    <p className="text-sm text-gray-600">Total Listings</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-2xl">
                    <ShoppingBag className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-800">{stats.availableProducts || 0}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl">
                    <Heart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-800">{wishlistCount}</p>
                    <p className="text-sm text-gray-600">Wishlist</p>
                  </div>

                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 border border-white/60"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-amber-600" />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link
                  to="/create-product"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 hover:from-amber-100 hover:to-yellow-100 rounded-xl transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">Sell an Item</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-amber-600">→</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 hover:from-amber-100 hover:to-yellow-100 rounded-xl transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">My Wishlist</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-amber-600">→</span>
                </Link>

                <Link
                  to="/products?my=true"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 hover:from-amber-100 hover:to-yellow-100 rounded-xl transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">My Listings</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-amber-600">→</span>
                </Link>

              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 border border-white/60"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-amber-600" />
                Account Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-bold text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-bold text-green-600">Active ✓</p>
                  </div>
                  <Award className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-bold text-gray-800">
                      {user.isSeller ? 'Seller' : 'Buyer'}
                      {user.role === 'admin' && ' • Admin'}
                    </p>
                  </div>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </motion.div>

            {/* Settings & Logout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 border border-white/60"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-amber-600" />
                Settings
              </h3>
              <div className="space-y-3">

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-xl transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-700">Log Out</span>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;