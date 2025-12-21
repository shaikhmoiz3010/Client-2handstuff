import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, BookOpen, Calculator, FileText, PenTool,
  TrendingUp, Shield, Users, ArrowRight, Sparkles, Star
} from 'lucide-react';
import { useProductsContext } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
// import ProductList from '../components/products/ProductList';
// import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const {
    featuredProducts,
    loading,
    fetchFeaturedProducts,
    fetchTrendingProducts
  } = useProductsContext();

  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    fetchFeaturedProducts();
    fetchTrendingProducts();
  }, [fetchFeaturedProducts, fetchTrendingProducts]);

  const categories = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      name: 'Textbooks',
      gradient: 'from-amber-400 via-yellow-500 to-amber-600',
      href: '/products?category=textbook'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      name: 'Notes',
      gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
      href: '/products?category=notes'
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      name: 'Calculators',
      gradient: 'from-amber-500 via-orange-400 to-amber-600',
      href: '/products?category=calculator'
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      name: 'Stationery',
      gradient: 'from-yellow-500 via-amber-500 to-orange-500',
      href: '/products?category=stationery'
    }
  ];

  // const features = [
  //   {
  //     icon: <Users className="w-6 h-6" />,
  //     title: 'Campus Verified',
  //     description: 'All users verified with university email addresses'
  //   },
  //   {
  //     icon: <TrendingUp className="w-6 h-6" />,
  //     title: 'Best Prices',
  //     description: 'Save up to 70% compared to buying new'
  //   }
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 via-transparent to-yellow-100/40"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-5 py-2 rounded-full mb-8 shadow-xl animate-pulse">
              {/* <Sparkles className="w-4 h-4" /> */}
              <span className="text-3xl font-bold tracking-wide">2-HAND STUFF</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-900 via-yellow-700 to-amber-900 bg-clip-text text-transparent leading-tight">
              Buy & Sell
              <br />
              <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                Study Materials
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto font-medium">
              Giving your textbooks, notes, calculators, and other stationery materials a second life
            </p>

            {/* Glass Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative backdrop-blur-2xl bg-white/80 rounded-3xl p-3 shadow-2xl border border-white/60 hover:shadow-amber-200/50 transition-all duration-300">
                <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 w-6 h-6 text-amber-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for textbooks, notes, calculators..."
                  className="w-full pl-16 pr-36 py-5 rounded-2xl bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg font-medium"
                />
                <Link
                  to={`/products?search=${encodeURIComponent(searchQuery)}`}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-8 py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
                >
                  Search
                </Link>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/products"
                className="group backdrop-blur-xl bg-white/90 text-amber-900 px-10 py-4 rounded-2xl font-bold hover:bg-white hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 border-2 border-amber-200/50 hover:border-amber-400 transform hover:scale-105"
              >
                <span className="text-lg">Browse Marketplace</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/create-product"
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:from-amber-600 hover:to-yellow-700"
              >
                <span className="text-lg">Sell Your Items</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">Explore our curated collection of study materials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={category.href}
                  className="group relative backdrop-blur-2xl bg-white/70 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/60 overflow-hidden transform hover:-translate-y-2 block"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-yellow-400/0 group-hover:from-amber-400/20 group-hover:to-yellow-400/20 transition-all duration-500"></div>

                  <div className={`relative w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {category.icon}
                  </div>
                  <h3 className="relative text-2xl font-bold mb-3 text-gray-800 group-hover:text-amber-900 transition-colors">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg">Hand-picked items just for you</p>
            </div>
            <Link
              to="/products"
              className="text-amber-700 hover:text-amber-900 font-bold text-lg flex items-center space-x-2 group mt-4 md:mt-0"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="backdrop-blur-2xl bg-white/70 rounded-3xl shadow-xl p-6 animate-pulse">
                  <div className="h-64 bg-gray-300/50 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-300/50 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300/50 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group backdrop-blur-2xl bg-white/70 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/60 transform hover:-translate-y-2"
                >
                  <Link to={`/products/${product._id}`} className="block">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 right-4 backdrop-blur-xl bg-white/90 text-amber-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>Featured</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-800 text-xl mb-3 line-clamp-1 group-hover:text-amber-900 transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-amber-700 font-bold text-2xl">₹{product.price}</p>
                        <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          {product.condition || 'Good'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{product.location}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent">
              Why Choose StudyMart?
            </h2>
            <p className="text-gray-600 text-lg">Your trusted campus marketplace</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative backdrop-blur-2xl bg-white/70 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/60 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-yellow-400/0 group-hover:from-amber-400/20 group-hover:to-yellow-400/20 transition-all duration-500"></div>
                
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="relative text-2xl font-bold mb-4 text-gray-800 group-hover:text-amber-900 transition-colors">{feature.title}</h3>
                <p className="relative text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Trending Products
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-2">
                Trending Now
              </h2>
              <p className="text-gray-600 text-lg">Most popular items this week</p>
            </div>
            <Link
              to="/products?sort=-views"
              className="text-amber-700 hover:text-amber-900 font-bold text-lg flex items-center space-x-2 group mt-4 md:mt-0"
            >
              <span>See More</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="backdrop-blur-2xl bg-white/70 rounded-3xl shadow-xl p-6 animate-pulse">
                  <div className="h-64 bg-gray-300/50 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-300/50 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300/50 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.slice(0, 4).map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group backdrop-blur-2xl bg-white/70 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/60 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center space-x-2 animate-pulse">
                      <TrendingUp className="w-4 h-4" />
                      <span>Hot</span>
                    </div>
                    <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {product.views || 0} views
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 text-xl mb-3 line-clamp-1 group-hover:text-amber-900 transition-colors">{product.title}</h3>
                    <p className="text-amber-700 font-bold text-2xl mb-2">${product.price}</p>
                    <p className="text-gray-600 text-sm">{product.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-amber-500/95 via-yellow-500/95 to-amber-600/95 rounded-[3rem] p-16 shadow-2xl overflow-hidden border border-amber-400/50">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300/20 rounded-full filter blur-3xl"></div>

            <div className="relative text-center text-white">
              <Sparkles className="w-16 h-16 mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Start Selling Today
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-amber-50 max-w-2xl mx-auto leading-relaxed">
                Turn your used study materials into cash and help fellow students save money
              </p>
              <Link
                to="/create-product"
                className="inline-flex items-center space-x-3 bg-white text-amber-700 px-10 py-5 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-110 text-lg"
              >
                <span>List Your First Item</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;