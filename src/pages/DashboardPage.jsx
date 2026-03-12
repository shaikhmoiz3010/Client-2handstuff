import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingBag, Eye, DollarSign,
  Package, CheckCircle, XCircle, Clock,
  ArrowUpRight, ArrowDownRight, Plus,
  BarChart3, Users, Star, Download,
  Edit, Trash2, MoreVertical, Sparkles,
  ExternalLink, Shield, TrendingDown,
  Calendar, Target, Award, Zap,
  MessageSquare, Heart, Bell, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/dashboard?range=${timeRange}`);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setActionLoading(true);
      await api.delete(`/products/${productId}`);
      // Refresh dashboard data
      fetchDashboardData();
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      setActionLoading(true);
      await api.put(`/products/${productId}`, { status: newStatus });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating product status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  const stats = dashboardData.dashboardStats;
  const recentProducts = dashboardData.recentProducts || [];
  const recentReviews = dashboardData.recentReviews || [];
  const performanceMetrics = dashboardData.performanceMetrics || {};

  const statCards = [
    {
      title: 'Total Listings',
      value: stats.totalProducts || 0,
      icon: <Package className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
      trend: '+12%',
      trendUp: true,
      description: 'Active listings'
    },
    {
      title: 'Available Items',
      value: stats.availableProducts || 0,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-emerald-500 to-green-600',
      trend: '+8%',
      trendUp: true,
      description: 'Ready to sell'
    },

  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent">
                    Seller Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Welcome back, <span className="font-semibold text-amber-800">{user?.name}</span>! Track your performance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="backdrop-blur-sm bg-white/80 border border-amber-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 90 days</option>
                <option value="year">Last year</option>
              </select>
              <Link
                to="/create-product"
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Listing</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-white/60"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                  stat.trendUp 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-800 font-medium mb-1">{stat.title}</p>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Listings with Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Listings with Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl p-6 border border-white/60"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">My Listings</h2>
                  <p className="text-gray-600">Manage your active products</p>
                </div>

              </div>
              
              {recentProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No listings yet</h3>
                  <p className="text-gray-600 mb-6">Start selling by creating your first listing</p>
                  <Link
                    to="/create-product"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create First Listing</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      whileHover={{ scale: 1.01 }}
                      className="group bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 p-4 border border-gray-200"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        {/* Product Info */}
                        <div className="flex items-start space-x-4 flex-1">
                          <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-gray-800 line-clamp-1">{product.title}</h4>
                                <div className="flex items-center flex-wrap gap-2 mt-2">
                                  <span className="text-lg font-bold text-amber-700">₹{product.price}</span>
                                  <span className="text-sm px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
                                    {product.category}
                                  </span>
                                  <span className={`text-sm px-2 py-1 rounded-lg ${
                                    product.condition === 'new' ? 'bg-emerald-100 text-emerald-800' :
                                    product.condition === 'like-new' ? 'bg-blue-100 text-blue-800' :
                                    product.condition === 'good' ? 'bg-amber-100 text-amber-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {product.condition}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center space-x-4">
                          {/* Status */}
                          <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              product.status === 'available'
                                ? 'bg-green-100 text-green-800'
                                : product.status === 'sold'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.status.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Action Dropdown */}
                          <div className="relative group">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                            
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                              {/* View Details */}
                              <Link
                                to={`/products/${product._id}`}
                                className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </Link>
                              
                              {/* Edit Product */}
                              <Link
                                to={`/products/${product._id}/edit`}
                                className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit Listing</span>
                              </Link>
                              

                              
                              {product.status === 'reserved' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(product._id, 'available')}
                                    className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-green-600 w-full text-left"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Mark as Available</span>
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(product._id, 'sold')}
                                    className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-green-600 w-full text-left"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Mark as Sold</span>
                                  </button>
                                </>
                              )}
                              
                              {/* Delete Button */}
                              <div className="border-t border-gray-200 my-2"></div>
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowDeleteModal(true);
                                }}
                                className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 text-red-600 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Listing</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Performance & Quick Actions */}
          <div className="space-y-8">


          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Listing</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<span className="font-semibold">{selectedProduct.title}</span>"?
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(selectedProduct._id)}
                  disabled={actionLoading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Deleting...' : 'Delete Listing'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;