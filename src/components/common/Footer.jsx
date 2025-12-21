import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Marketplace: [
      { label: 'Browse Products', href: '/products' },
      { label: 'Categories', href: '/products?category=textbook' },
      { label: 'Sell Items', href: '/create-product' },
    ],
    Support: [
      { label: 'About Us', href: '/about' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-amber-50 to-white border-t border-amber-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">2-Hand Stuff</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Connecting students with affordable study materials. Buy and sell textbooks, 
              notes, calculators, and stationery items in your campus community.
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-amber-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-amber-200/30 text-center">
          <p className="text-gray-600">
            © {currentYear} 2-Hand Stuff. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Making education accessible and affordable for every student.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;