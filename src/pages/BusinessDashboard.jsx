import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PropertyCard } from '../components/PropertyCard';
import { WantedAdCard } from '../components/WantedAdCard';
import { Plus, Briefcase, Home, TrendingUp, Eye } from 'lucide-react';
import { wantedAdsAPI, propertiesAPI } from '../utils/api';

export const BusinessDashboard = () => {
  const { user, isPaid } = useAuth();
  const [myAds, setMyAds] = useState([]);
  const [matchingProperties, setMatchingProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('ads'); // 'ads' or 'matches'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id && !user?._id) return;
      
      try {
        setLoading(true);
        
        // Fetch user's wanted ads from API
        const adsResponse = await wantedAdsAPI.getMyListings(user.id || user._id);
        const userAds = adsResponse.data || [];
        setMyAds(userAds);

        // Fetch all properties and filter for matches
        const propertiesResponse = await propertiesAPI.getAll();
        const allProperties = propertiesResponse.data || [];
        
        // Match properties based on business type
        const matches = allProperties.filter((property) => {
          return userAds.some((ad) => 
            property.businessModels?.includes(ad.businessType)
          );
        });
        setMatchingProperties(matches);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDelete = async (adId) => {
    try {
      await wantedAdsAPI.delete(adId, user.id || user._id);
      setMyAds(myAds.filter((ad) => ad._id !== adId));
    } catch (error) {
      console.error('Error deleting wanted ad:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Business Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Welcome back, <span className="font-semibold text-primary-600">{user?.name}</span>! Manage your wanted ads and find suitable properties.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Active Wanted Ads</p>
                <p className="text-4xl font-bold text-gray-900">{myAds.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl">
                <Briefcase className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Matching Properties</p>
                <p className="text-4xl font-bold text-gray-900">{matchingProperties.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                <Home className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Account Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isPaid ? (
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                      Pro
                    </span>
                  ) : (
                    'Free'
                  )}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Banner */}
        {!isPaid && (
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white rounded-2xl p-8 mb-10 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3">Upgrade to Pro</h3>
                <p className="text-primary-100 text-lg mb-6 max-w-2xl">
                  Unlock unlimited wanted ads, view landlord contact details, and get priority placement in search results
                </p>
                <Link 
                  to="/pricing" 
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 inline-flex items-center space-x-2 shadow-lg"
                >
                  <span>View Plans</span>
                  <TrendingUp className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-10">
          <Link
            to="/business/add-wanted-ad"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Post New Wanted Ad</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('ads')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-all duration-200 ${
                  activeTab === 'ads'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Wanted Ads ({myAds.length})
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-all duration-200 ${
                  activeTab === 'matches'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Matching Properties ({matchingProperties.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-6 text-lg">Loading your dashboard...</p>
          </div>
        ) : activeTab === 'ads' && (
          <div>
            {myAds.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4 bg-primary-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Wanted Ads Posted Yet
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Post your first wanted ad to let landlords know what you're looking for and connect with suitable properties
                </p>
                <Link 
                  to="/business/add-wanted-ad" 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>Post Your First Wanted Ad</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAds.map((ad) => (
                  <div key={ad._id} className="relative group">
                    <WantedAdCard ad={ad} />
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/wanted-ads/${ad._id}`}
                        className="bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm shadow-lg border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(ad._id);
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors duration-200 bg-white shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            {matchingProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4 bg-green-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Home className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Matching Properties Yet
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Properties matching your requirements will appear here. Make sure your wanted ad details are complete to get better matches.
                </p>
                <Link 
                  to="/properties" 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Browse All Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

