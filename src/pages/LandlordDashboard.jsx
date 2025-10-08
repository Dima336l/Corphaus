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
    if (!window.confirm('Are you sure you want to delete this property listing?')) {
      return;
    }

    try {
      await propertiesAPI.delete(propertyId, user.id || user._id);
      setMyProperties(myProperties.filter((p) => p._id !== propertyId));
      alert('Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Landlord Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Manage your properties and find business tenants.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900">{myProperties.length}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Matching Businesses</p>
                <p className="text-3xl font-bold text-gray-900">{matchingAds.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Account Status</p>
                <p className="text-xl font-bold text-gray-900">
                  {isPaid ? 'Pro' : 'Free'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Banner */}
        {!isPaid && (
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-primary-100 mb-4">
                  Unlock unlimited listings, view full contact details, and get a verified badge
                </p>
                <Link to="/pricing" className="btn-secondary inline-block">
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <Link
            to="/landlord/add-property"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>List New Property</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('properties')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'properties'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              My Properties ({myProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'matches'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Matching Businesses ({matchingAds.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your dashboard...</p>
          </div>
        ) : activeTab === 'properties' && (
          <div>
            {myProperties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Properties Listed Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by listing your first property to connect with businesses
                </p>
                <Link to="/landlord/add-property" className="btn-primary inline-flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>List Your First Property</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myProperties.map((property) => (
                  <div key={property._id} className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4">
                    <div className="flex-1">
                      <PropertyCard property={property} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/properties/${property._id}`}
                        className="btn-secondary text-sm flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
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
              <div className="text-center py-12 bg-white rounded-2xl">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Matching Businesses Yet
                </h3>
                <p className="text-gray-600">
                  Businesses looking for properties like yours will appear here
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

