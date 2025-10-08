import { useState, useEffect } from 'react';
import { WantedAdCard } from '../components/WantedAdCard';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { businessModels, bedroomOptions } from '../data/formOptions';

export const WantedAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    businessType: '',
    minBedrooms: 0,
    wheelchairAccessible: false,
  });

  useEffect(() => {
    // Load wanted ads from localStorage
    const storedAds = JSON.parse(localStorage.getItem('corphaus_wanted_ads') || '[]');
    setAds(storedAds);
    setFilteredAds(storedAds);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = ads;

    if (filters.search) {
      filtered = filtered.filter(
        (ad) =>
          ad.preferredLocation?.toLowerCase().includes(filters.search.toLowerCase()) ||
          ad.companyName?.toLowerCase().includes(filters.search.toLowerCase()) ||
          ad.businessType?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.businessType) {
      filtered = filtered.filter((ad) => ad.businessType === filters.businessType);
    }

    if (filters.minBedrooms > 0) {
      filtered = filtered.filter((ad) => ad.minBedrooms >= filters.minBedrooms);
    }

    if (filters.wheelchairAccessible) {
      filtered = filtered.filter((ad) => ad.needsWheelchairAccessible);
    }

    setFilteredAds(filtered);
  }, [filters, ads]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      businessType: '',
      minBedrooms: 0,
      wheelchairAccessible: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Wanted Ads
          </h1>
          <p className="text-gray-600">
            Browse businesses looking for properties to rent
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by business name, type, or location..."
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={filters.businessType}
                      onChange={handleFilterChange}
                      className="input-field text-sm"
                    >
                      <option value="">All Types</option>
                      {businessModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Bedrooms Required
                    </label>
                    <select
                      name="minBedrooms"
                      value={filters.minBedrooms}
                      onChange={handleFilterChange}
                      className="input-field text-sm"
                    >
                      {bedroomOptions.map((num) => (
                        <option key={num} value={num}>
                          {num}+
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 border-t">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="wheelchairAccessible"
                        checked={filters.wheelchairAccessible}
                        onChange={handleFilterChange}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Needs Wheelchair Access</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredAds.length}</span>{' '}
                {filteredAds.length === 1 ? 'ad' : 'ads'} found
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ads Grid/List */}
            {filteredAds.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No wanted ads found matching your criteria</p>
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredAds.map((ad) => (
                  <WantedAdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

