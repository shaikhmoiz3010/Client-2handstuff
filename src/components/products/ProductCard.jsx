import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  BookOpen, 
  Heart,
  Eye,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProductsContext } from '../../context/ProductContext';
import { formatPrice } from '../../utils/formatters';

const ProductCard = ({ product, isFeatured = false, isTrending = false }) => {
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useProductsContext();

  const conditionColors = {
    'new': 'bg-gradient-to-r from-emerald-500 to-green-600',
    'like-new': 'bg-gradient-to-r from-blue-500 to-cyan-600',
    'good': 'bg-gradient-to-r from-amber-500 to-yellow-600',
    'fair': 'bg-gradient-to-r from-gray-500 to-slate-600'
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }

    try {
      await toggleWishlist(product._id);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const isProductInWishlist = isInWishlist(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-50">
          {/* Main Image */}
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white shadow-md ${conditionColors[product.condition] || conditionColors.good}`}>
              {product.condition === 'like-new' ? 'Like New' : product.condition}
            </span>
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isProductInWishlist
                ? 'bg-red-50 text-red-500 shadow-sm'
                : 'bg-white/90 text-gray-500 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Heart className={`w-4 h-4 ${isProductInWishlist ? 'fill-current' : ''}`} />
          </button>
          
          {/* Featured/Trending Badge */}
          {isFeatured && (
            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </div>
          )}
          
          {isTrending && (
            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-red-500 to-orange-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Trending</span>
            </div>
          )}
          
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-4">
        {/* Title and Price Row */}
        <div className="mb-3">
          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-1 text-sm mb-1">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-amber-700">
              {formatPrice(product.price)}
            </span>
            {product.isNegotiable && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                Negotiable
              </span>
            )}
          </div>
        </div>
        
        {/* Category and Location */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-3 h-3" />
            <span className="capitalize">{product.category}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{product.location}</span>
          </div>
        </div>
        

        {/* Quick Action Button */}
        <Link
          to={`/products/${product._id}`}
          className="mt-4 block w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white py-2 rounded-lg text-sm font-medium text-center transition-all duration-200 hover:shadow-md"
        >
          View Details
        </Link>
      </div>

    </motion.div>
  );
};

export default ProductCard;