import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContent';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { 
  LogOut, 
  User, 
  Menu, 
  X, 
  Bell, 
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
  
    { id: 1, message: 'Welcome to Task Manager!', time: '2 days ago', read: true }
  ]);
  
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // User dropdown will be handled by CSS :hover
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const headerClasses = `
    bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600
    shadow-lg backdrop-blur-sm bg-opacity-95
    sticky top-0 z-50
    transition-all duration-300 ease-in-out
    ${isScrolled ? 'py-2 shadow-xl' : 'py-3'}
    border-b border-purple-400/30
  `;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
    }
  };

  const handleCreateTask = () => {
    console.log('Create new task');
    // Implement create task functionality
  };

  return (
    <>
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Left Section - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-900 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-purple-400/20 hover:ring-purple-400/40 transition-all duration-300">
                    <span className="text-white font-bold text-lg">TM</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full ring-2 ring-purple-900 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Task Manager
                  </h1>
                  <p className="text-xs text-purple-200 hidden sm:block">
                    Stay Organized & Productive
                  </p>
                </div>
              </div>  
            </div>



            {/* Right Section - User Actions */}
            <div className="flex items-center space-x-2">
          
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-200 transform hover:scale-110"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-200 transform hover:scale-110"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-in">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                          {unreadNotifications} unread
                        </span>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                      <button className="w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 py-2 transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Desktop */}
              <div className="hidden md:flex items-center space-x-2" ref={dropdownRef}>
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-700/50 transition-all duration-200 group">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-purple-200">{user?.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-purple-400/30 group-hover:ring-purple-400/50 transition-all duration-200">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-purple-200 group-hover:text-white transition-transform group-hover:rotate-180 duration-200" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-14 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-200 transform hover:scale-110"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-6 space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-1">
              <button 
                onClick={toggleDarkMode}
                className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200"
              >
                {darkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;