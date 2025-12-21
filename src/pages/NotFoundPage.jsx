import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Compass, Sparkles, AlertTriangle, BookOpen, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-5 py-2 rounded-full mb-8 shadow-xl">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide">PAGE NOT FOUND</span>
          </div>

          {/* Animated 404 */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="text-9xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent"
            >
              404
            </motion.div>
            
            {/* Floating Ghost Icon */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
              className="absolute top-4 right-24"
            >
              <Ghost className="w-16 h-16 text-amber-600/40" />
            </motion.div>
            
            {/* Floating Book Icon */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute bottom-8 left-24"
            >
              <BookOpen className="w-12 h-12 text-yellow-600/30" />
            </motion.div>
          </div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 bg-clip-text text-transparent mb-4">
              Lost in the Library?
            </h1>
            <p className="text-lg text-gray-700 mb-2 max-w-lg mx-auto leading-relaxed">
              This page seems to have been checked out and never returned. 
              Don't worry, even the best study materials sometimes get misplaced!
            </p>
            <p className="text-gray-600">
              Error code: <span className="font-mono bg-amber-100 text-amber-800 px-2 py-1 rounded">404_NOT_FOUND</span>
            </p>
          </motion.div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="block backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-white/60 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Go Home</h3>
                <p className="text-sm text-gray-600">Return to the main page</p>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                to="/products"
                className="block backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-white/60 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Browse Products</h3>
                <p className="text-sm text-gray-600">Explore study materials</p>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => window.history.back()}
                className="w-full backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-white/60 group text-left"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <ArrowLeft className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Go Back</h3>
                <p className="text-sm text-gray-600">Return to previous page</p>
              </button>
            </motion.div>
          </div>


   


        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;