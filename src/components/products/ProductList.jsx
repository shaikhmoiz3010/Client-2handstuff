import React from 'react';
import { motion } from 'framer-motion';
import { Grid, List } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductList = ({ 
  products, 
  viewMode = 'grid',
  onViewModeChange,
  isLoading = false
}) => {
  
  // List View - Premium Style
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-56 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white ${
                      product.condition === 'new' ? 'bg-emerald-600' :
                      product.condition === 'like-new' ? 'bg-blue-600' :
                      product.condition === 'good' ? 'bg-amber-600' :
                      'bg-gray-600'
                    }`}>
                      {product.condition === 'like-new' ? 'Like New' : product.condition}
                    </span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="md:text-right mt-4 md:mt-0 md:ml-6">
                      <p className="text-2xl font-bold text-amber-700 mb-1">${product.price}</p>
                      {product.isNegotiable && (
                        <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-medium">
                          Negotiable
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                    <span className="inline-flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">{product.category}</span>
                    </span>
                    <span className="inline-flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <span className="font-medium text-gray-700">{product.location}</span>
                    </span>
                  </div>
                  
                  {/* Seller and Action */}
                  <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-100">

                    <a
                      href={`/products/${product._id}`}
                      className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-200 w-full md:w-auto text-center"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Grid View with View Mode Toggle
  return (
    <>
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex justify-end mb-6">
          <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductList;