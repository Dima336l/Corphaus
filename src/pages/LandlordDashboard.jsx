import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PropertyCard } from '../components/PropertyCard';
import { WantedAdCard } from '../components/WantedAdCard';
import { Plus, Home, Briefcase, TrendingUp, Eye } from 'lucide-react';
import { propertiesAPI, wantedAdsAPI } from '../utils/api';

export const LandlordDashboard = () => {
  const { user, isPaid } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [matchingAds, setMatchingAds] = useState([]);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' or 'matches'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id && !user?._id) return;
      
      try {
        setLoading(true);
        
        // Fetch user's properties from API
        const propertiesResponse = await propertiesAPI.getMyListings(user.id || user._id);
        const userProperties = propertiesResponse.data || [];
        setMyProperties(userProperties);

        // Fetch all wanted ads and filter for matches
        const adsResponse = await wantedAdsAPI.getAll();
        const allAds = adsResponse.data || [];
        
        // Match wanted ads based on business models
        const matches = allAds.filter((ad) => {
          return userProperties.some((prop) => 
            prop.businessModels?.includes(ad.businessType)
          );
        });
        setMatchingAds(matches);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDelete = async (propertyId) => {
    try {
      await propertiesAPI.delete(propertyId, user.id || user._id);
      setMyProperties(myProperties.filter((p) => p._id !== propertyId));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Landlord Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Welcome back, <span className="font-semibold text-primary-600">{user?.name}</span>! Manage your properties and find business tenants.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Active Listings</p>
                <p className="text-4xl font-bold text-gray-900">{myProperties.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Matching Businesses</p>
                <p className="text-4xl font-bold text-gray-900">{matchingAds.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                <Briefcase className="w-8 h-8 text-green-600" />
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
                  Unlock unlimited listings, view full contact details, and get a verified badge to stand out from the competition
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
            to="/landlord/add-property"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>List New Property</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('properties')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-all duration-200 ${
                  activeTab === 'properties'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Properties ({myProperties.length})
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-all duration-200 ${
                  activeTab === 'matches'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Matching Businesses ({matchingAds.length})
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
        ) : activeTab === 'properties' && (
          <div>
            {myProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4 bg-primary-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Home className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Properties Listed Yet
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Start by listing your first property to connect with businesses and grow your rental income
                </p>
                <Link 
                  to="/landlord/add-property" 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>List Your First Property</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map((property) => (
                  <div key={property._id} className="relative group">
                    <PropertyCard property={property} />
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/properties/${property._id}`}
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
                          handleDelete(property._id);
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
            {matchingAds.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4 bg-green-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Matching Businesses Yet
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Businesses looking for properties like yours will appear here. Make sure your property details are complete to get better matches.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingAds.map((ad) => (
                  <WantedAdCard key={ad._id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

