import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PropertyCard } from '../components/PropertyCard';
import { WantedAdCard } from '../components/WantedAdCard';
import { Plus, Briefcase, Home, TrendingUp, Eye } from 'lucide-react';

export const BusinessDashboard = () => {
  const { user, isPaid } = useAuth();
  const [myAds, setMyAds] = useState([]);
  const [matchingProperties, setMatchingProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('ads'); // 'ads' or 'matches'

  useEffect(() => {
    // Load user's wanted ads
    const allAds = JSON.parse(localStorage.getItem('corphaus_wanted_ads') || '[]');
    const userAds = allAds.filter((ad) => ad.userId === user?.id);
    setMyAds(userAds);

    // Load matching properties (simple matching based on business type)
    const allProperties = JSON.parse(localStorage.getItem('corphaus_properties') || '[]');
    const matches = allProperties.filter((property) => {
      return userAds.some((ad) => 
        property.businessModels?.includes(ad.businessType)
      );
    });
    setMatchingProperties(matches);
  }, [user]);

  const handleDelete = (adId) => {
    if (!window.confirm('Are you sure you want to delete this wanted ad?')) {
      return;
    }

    const allAds = JSON.parse(localStorage.getItem('corphaus_wanted_ads') || '[]');
    const updated = allAds.filter((ad) => ad.id !== adId);
    localStorage.setItem('corphaus_wanted_ads', JSON.stringify(updated));
    setMyAds(myAds.filter((ad) => ad.id !== adId));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Business Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Manage your wanted ads and find suitable properties.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Wanted Ads</p>
                <p className="text-3xl font-bold text-gray-900">{myAds.length}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <Briefcase className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Matching Properties</p>
                <p className="text-3xl font-bold text-gray-900">{matchingProperties.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Home className="w-8 h-8 text-green-600" />
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
                  Unlock unlimited wanted ads, view landlord contact details, and get priority placement
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
            to="/business/add-wanted-ad"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Post New Wanted Ad</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('ads')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'ads'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              My Wanted Ads ({myAds.length})
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'matches'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Matching Properties ({matchingProperties.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'ads' && (
          <div>
            {myAds.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Wanted Ads Posted Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Post your first wanted ad to let landlords know what you're looking for
                </p>
                <Link to="/business/add-wanted-ad" className="btn-primary inline-flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Post Your First Wanted Ad</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myAds.map((ad) => (
                  <div key={ad.id} className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4">
                    <div className="flex-1">
                      <WantedAdCard ad={ad} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/wanted-ads/${ad.id}`}
                        className="btn-secondary text-sm flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(ad.id)}
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
            {matchingProperties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Matching Properties Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Properties matching your requirements will appear here
                </p>
                <Link to="/properties" className="btn-primary">
                  Browse All Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

