import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, Sparkles, ArrowLeft, IndianRupee, Star, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProductsContext } from '../context/ProductContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const { toggleWishlist } = useProductsContext();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wishlist');
      setWishlist(response.data.data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      setWishlist(wishlist.filter(item => item.product?._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-4">
            Save Your Favorites
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sign in to create your personal wishlist and save study materials for later.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="border-2 border-amber-500 text-amber-700 px-8 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your wishlist..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-700 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">WISHLIST</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-12 text-center border border-white/60"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-16 h-16 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring study materials and save the ones you love by clicking the heart icon.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-lg">Browse Products</span>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-8 backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl p-6 border border-white/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                  <p className="text-2xl font-bold text-gray-800">{wishlist.length}</p>
                  <p className="text-sm text-gray-600">Total Items</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{wishlist.reduce((sum, item) => sum + (item.product?.price || 0), 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-600">Total Value</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                  <p className="text-2xl font-bold text-gray-800">
                    {wishlist.filter(item => item.product?.status === 'available').length}
                  </p>
                  <p className="text-sm text-gray-600">Available Now</p>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/60"
                >
                  {/* Image Section */}
                  <Link to={`/products/${item.product?._id}`}>
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
                      <img
                        src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'}
                        alt={item.product?.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          item.product?.condition === 'new' ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                          item.product?.condition === 'like-new' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                          item.product?.condition === 'good' ? 'bg-gradient-to-r from-amber-500 to-yellow-600' :
                          'bg-gradient-to-r from-gray-500 to-slate-600'
                        }`}>
                          {item.product?.condition || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Content Section */}
                  <div className="p-5">
                    <div className="mb-4">
                      <Link to={`/products/${item.product?._id}`}>
                        <h3 className="font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-amber-700 transition-colors">
                          {item.product?.title || 'Untitled'}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline space-x-1">
                          <IndianRupee className="w-4 h-4 text-amber-700" />
                          <span className="text-2xl font-bold text-amber-700">
                            {item.product?.price || 0}
                          </span>
                        </div>
                        {item.product?.status === 'sold' && (
                          <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 rounded-lg text-xs font-bold">
                            Sold
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {item.product?.description || 'No description available.'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => removeFromWishlist(item.product?._id)}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-2 border-red-200 rounded-xl font-semibold hover:shadow transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                      <Link
                        to={`/products/${item.product?._id}`}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-12 backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl p-8 border border-white/60">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Purchase?</h3>
                <p className="text-gray-600 mb-6">Items in your wishlist are waiting for you!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/products"
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => toast('Bulk purchase coming soon!', { icon: '🚀' })}
                    className="px-8 py-3 border-2 border-amber-500 text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-all"
                  >
                    Buy All (₹{wishlist.reduce((sum, item) => sum + (item.product?.price || 0), 0).toLocaleString('en-IN')})
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;