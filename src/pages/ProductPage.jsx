import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, User, Star, Phone, Mail, Link,
  Heart, Share2, CheckCircle, AlertCircle,
  Calendar, DollarSign, Package, Eye, MessageCircle,
  Edit, Trash2, Shield, Sparkles, TrendingUp, BookOpen,
  Clock, Users, Award, Zap, ExternalLink, GraduationCap
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { useAuth } from '../context/AuthContext';
import { useProductsContext } from '../context/ProductContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    getProduct, 
    deleteProduct,
    toggleWishlist, 
    isInWishlist: checkWishlistStatus,
    fetchWishlist,
    wishlist 
  } = useProductsContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const isProductOwner = user && product && product.seller && product.seller._id === user._id;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && isAuthenticated && wishlist) {
      const inWishlist = wishlist.some(item => item.product?._id === product._id);
      setIsInWishlist(inWishlist);
    }
  }, [product, wishlist, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProduct(id);
      setProduct(response.data.product);
      
      if (isAuthenticated) {
        await fetchWishlist();
      }
    } catch (err) {
      setError('Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast('Please login to add to wishlist', {
        icon: '🔒',
        duration: 3000,
      });
      return;
    }

    try {
      const added = await toggleWishlist(product._id);
      setIsInWishlist(added);
      toast.success(added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleEditProduct = () => {
    navigate(`/products/${product._id}/edit`);
  };

  const handleDeleteProduct = async () => {
    if (!isProductOwner && user?.role !== 'admin') {
      toast.error('You are not authorized to delete this product');
      return;
    }

    setDeleting(true);
    try {
      await deleteProduct(product._id);
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast('Please login to contact seller', {
        icon: '🔒',
        duration: 3000,
      });
      return;
    }
    
    setShowComingSoon(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.category} on StudyMart`,
          url: window.location.href,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-amber-700 mb-6 hover:text-amber-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>
          
          <div className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-8 text-center border border-white/60">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-2">
              {error || 'Product not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              This study material might have been sold or removed from our library.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Browse Other Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const conditionColors = {
    'new': 'bg-gradient-to-r from-emerald-500 to-green-600',
    'like-new': 'bg-gradient-to-r from-blue-500 to-cyan-600',
    'good': 'bg-gradient-to-r from-amber-500 to-yellow-600',
    'fair': 'bg-gradient-to-r from-gray-500 to-slate-600'
  };

  const statusColors = {
    'available': 'bg-gradient-to-r from-green-500 to-emerald-600',
    'sold': 'bg-gradient-to-r from-red-500 to-pink-600',
    'reserved': 'bg-gradient-to-r from-yellow-500 to-orange-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-amber-700 hover:text-amber-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>

          <div className="flex flex-wrap gap-3">
            {isProductOwner && (
              <div className="flex gap-2">
                <button
                  onClick={handleEditProduct}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Listing</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            {user?.role === 'admin' && !isProductOwner && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Admin View</span>
              </div>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-amber-500 text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-white/60"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Delete Listing</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">"{product.title}"</span>? 
                This action cannot be undone.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={deleting}
                  className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Coming Soon Modal */}
        {showComingSoon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowComingSoon(false)}
              className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-white/60 cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-4">
                Feature Coming Soon!
              </h3>
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Direct messaging with sellers</span> is currently in development.
                </p>
                <p className="text-gray-600 text-sm">
                  We're working hard to bring you a secure and seamless communication platform.
                </p>
                <div className="flex items-center justify-center space-x-2 text-amber-600 mt-4">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Launching soon!</span>
                </div>
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all w-full">
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            {/* Main Image Carousel */}
            <div className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-4 mb-4 border border-white/60">
              <Swiper
                spaceBetween={10}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Pagination, Thumbs]}
                className="rounded-2xl"
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="h-96 flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl overflow-hidden">
                        <img
                          src={image}
                          alt={`${product.title} - Image ${index + 1}`}
                          className="w-full h-full object-contain p-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-product.jpg';
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="h-96 flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl">
                      <div className="text-center">
                        <Package className="w-20 h-20 text-amber-400 mx-auto mb-4" />
                        <p className="text-gray-600">No images available</p>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-4 border border-white/60">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  watchSlidesProgress
                  modules={[Thumbs]}
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="aspect-square cursor-pointer border-2 border-transparent hover:border-amber-500 rounded-xl overflow-hidden transition-all bg-gradient-to-br from-amber-50 to-yellow-50">
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover p-1"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-product.jpg';
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Product Header Card */}
            <div className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 border border-white/60">
              {/* Condition & Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-4 py-2 rounded-xl text-sm font-bold text-white shadow ${conditionColors[product.condition] || 'bg-gradient-to-r from-gray-500 to-slate-600'}`}>
                  {product.condition ? product.condition.replace('-', ' ') : 'Unknown'}
                </span>
                <span className={`px-4 py-2 rounded-xl text-sm font-bold text-white shadow ${statusColors[product.status] || 'bg-gradient-to-r from-gray-500 to-slate-600'}`}>
                  {product.status?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>

              {/* Title & Location */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{product.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>{product.location || 'Location not specified'}</span>
                </div>
                {product.university && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                    <span>{product.university}</span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl">
                <div className="flex items-baseline space-x-3">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ₹{product.price || '0'}
                      </span>
                      {product.isNegotiable && (
                        <span className="text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1.5 rounded-xl font-bold shadow">
                          Negotiable
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">Starting price</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleContactSeller}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white py-3.5 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Seller</span>
                </button>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-6 border border-white/60">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Seller Information</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">


                {/* Seller Details */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h4 className="font-bold text-lg text-gray-800">{product.seller?.name || 'Anonymous Seller'}</h4>
                    {product.seller?.university && (
                      <p className="text-gray-600 mt-1 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        {product.seller.university}
                      </p>
                    )}
                  </div>

                  {/* Seller Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-gray-800">
                          {product.seller?.createdAt ? new Date(product.seller.createdAt).getFullYear() : 'N/A'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Member since</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-bold text-gray-800">Verified</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Card */}
            <div className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`flex-1 py-4 text-center font-semibold transition-colors ${
                      activeTab === 'description'
                        ? 'text-amber-700 border-b-2 border-amber-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Description
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 text-lg">About This Item</h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description || 'No description provided for this item.'}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-bold text-gray-800 capitalize">{product.category || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Listed Date</p>
                          <p className="font-bold text-gray-800">
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center">
                          <Award className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Condition</p>
                          <p className="font-bold text-gray-800 capitalize">
                            {product.condition ? product.condition.replace('-', ' ') : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;