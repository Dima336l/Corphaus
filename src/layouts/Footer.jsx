import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Corphaus</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting landlords with businesses for commercial property lets across the UK.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/wanted-ads" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Wanted Ads
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Users</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="hover:text-primary-400 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-400 hover:text-blue-400 transition-colors">info@corphaus.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-400 hover:text-blue-400 transition-colors">+44 20 1234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-400 hover:text-blue-400 transition-colors">London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">&copy; {new Date().getFullYear()} Corphaus. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Privacy Policy</a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Terms of Service</a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

