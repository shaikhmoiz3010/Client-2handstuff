import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, LogOut, BookOpen, ShoppingBag, Sparkles, Crown, PlusCircle, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/products', label: 'Browse', icon: <ShoppingBag className="w-4 h-4" /> },
    ...(isAuthenticated ? [
      { path: '/create-product', label: 'Sell', icon: <PlusCircle className="w-4 h-4" /> },
      { path: '/dashboard', label: 'Dashboard', icon: <User className="w-4 h-4" /> },
    ] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-amber-100 shadow-lg shadow-amber-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Elegant Design */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/40 transition-shadow">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                  2-Hand Stuff
                </span>
                {/* <Sparkles className="w-4 h-4 text-amber-400 hidden md:block" /> */}
              </div>
              <span className="text-xs text-gray-500 font-light">Academic Marketplace</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-200/30 transition-all duration-300 shadow-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search textbooks, notes, calculators..."
                    className="w-full px-4 py-2.5 pl-10 pr-4 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50/50 text-amber-700 border border-amber-200/50 shadow-sm'
                    : 'text-gray-700 hover:bg-amber-50/50 hover:text-amber-600 hover:border hover:border-amber-200/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-amber-600' : 'text-gray-500 group-hover:text-amber-500'}`}>
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-3 pl-3 border-l border-amber-100">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-amber-50/50 transition-colors cursor-pointer">
                    <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-amber-500 border-2 border-amber-200 shadow-sm">
                      <span className="text-lg font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">{user?.name?.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-amber-200/50 py-2 mt-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-amber-50/50 hover:text-amber-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <div className="border-t border-amber-100 my-1"></div>
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50/50 transition-colors rounded-none"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-3 pl-3 border-l border-amber-100">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-amber-700 hover:text-amber-800 hover:bg-amber-50/50 rounded-xl transition-colors font-medium border border-amber-200/50 hover:border-amber-300/50"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-medium shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-300"
                  >
                    Join Free
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors border border-amber-200/30"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-amber-600" />
            ) : (
              <Menu className="w-6 h-6 text-amber-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-amber-100"
          >
            <div className="px-4 py-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-yellow-50/10 rounded-xl blur-sm"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl shadow-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search study materials..."
                      className="w-full px-4 py-3 pl-10 pr-4 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                    />
                  </div>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => {
                      const activeClasses = isActive
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50/50 text-amber-700 border border-amber-200/50'
                        : 'text-gray-700 hover:bg-amber-50/50 hover:text-amber-600';
                      return `group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${activeClasses}`;
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`${isActive ? 'text-amber-600' : 'text-gray-500 group-hover:text-amber-500'}`}>
                          {link.icon}
                        </span>
                        <span className="font-medium">{link.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Mobile User Section */}
              {isAuthenticated ? (
                <>
                  <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50/30 rounded-xl border border-amber-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={user?.avatar || '/default-avatar.png'}
                          alt={user?.name}
                          className="w-12 h-12 rounded-full border-2 border-amber-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-3 py-2 text-center text-sm bg-white border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 text-red-600 hover:bg-red-50/50 rounded-xl border border-red-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-2">Join our community of students</p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-amber-200 rounded-full"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 text-center text-amber-700 border border-amber-300 rounded-xl hover:bg-amber-50/50 transition-colors font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium shadow-md shadow-amber-500/30"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;