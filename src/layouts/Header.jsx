import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Menu, X, User, LogOut, LayoutDashboard, Home, PlusCircle, ListChecks, Briefcase, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { messagesAPI } from '../utils/api';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user?._id) {
        try {
          const response = await messagesAPI.getUnreadCount(user._id);
          setUnreadCount(response.count || 0);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      }
    };

    fetchUnreadCount();

    // Poll every 30 seconds for new messages
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    return user?.role === 'landlord' ? '/landlord/dashboard' : '/business/dashboard';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Corphaus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Guest Navigation */}
            {!isAuthenticated && (
              <>
                <Link to="/properties" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Browse Properties
                </Link>
                <Link to="/wanted-ads" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Wanted Ads
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Pricing
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Contact
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}

            {/* Landlord Navigation */}
            {isAuthenticated && user?.role === 'landlord' && (
              <>
                <Link to="/wanted-ads" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  <Briefcase className="w-4 h-4" />
                  <span>Browse Wanted Ads</span>
                </Link>
                <Link to="/landlord/add-property" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  <PlusCircle className="w-4 h-4" />
                  <span>List Property</span>
                </Link>
                <Link to="/messages" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors relative">
                  <MessageCircle className="w-4 h-4" />
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/landlord/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Pricing
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-lg border border-primary-200">
                    <Home className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                      Landlord
                    </span>
                    {user?.isPaid && (
                      <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                        Pro
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}

            {/* Business Navigation */}
            {isAuthenticated && user?.role === 'business' && (
              <>
                <Link to="/properties" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Browse Properties</span>
                </Link>
                <Link to="/business/add-wanted-ad" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Wanted Ad</span>
                </Link>
                <Link to="/messages" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors relative">
                  <MessageCircle className="w-4 h-4" />
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/business/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Pricing
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                      Business
                    </span>
                    {user?.isPaid && (
                      <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                        Pro
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {/* Guest Mobile Menu */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/properties"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Properties
                </Link>
                <Link
                  to="/wanted-ads"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wanted Ads
                </Link>
                <Link
                  to="/pricing"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="block btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Landlord Mobile Menu */}
            {isAuthenticated && user?.role === 'landlord' && (
              <>
                <div className="flex items-center space-x-2 py-2 px-3 bg-primary-50 rounded-lg border border-primary-200">
                  <Home className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                    Landlord
                  </span>
                  {user?.isPaid && (
                    <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                      Pro
                    </span>
                  )}
                </div>
                <Link
                  to="/landlord/dashboard"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/landlord/add-property"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ➕ List Property
                </Link>
                <Link
                  to="/wanted-ads"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💼 Browse Wanted Ads
                </Link>
                <Link
                  to="/messages"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2 relative"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💬 Messages
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/pricing"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
                >
                  Logout
                </button>
              </>
            )}

            {/* Business Mobile Menu */}
            {isAuthenticated && user?.role === 'business' && (
              <>
                <div className="flex items-center space-x-2 py-2 px-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                    Business
                  </span>
                  {user?.isPaid && (
                    <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                      Pro
                    </span>
                  )}
                </div>
                <Link
                  to="/business/dashboard"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/business/add-wanted-ad"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ➕ Post Wanted Ad
                </Link>
                <Link
                  to="/properties"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏠 Browse Properties
                </Link>
                <Link
                  to="/messages"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2 relative"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💬 Messages
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/pricing"
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

