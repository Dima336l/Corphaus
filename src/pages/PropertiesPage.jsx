import { useState, useEffect } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { propertyTypes, businessModels, bedroomOptions } from '../data/formOptions';

export const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    minBedrooms: 0,
    businessModel: '',
    hasParking: false,
    wheelchairAccessible: false,
    furnished: false,
  });

  useEffect(() => {
    // Load properties from localStorage
    const storedProperties = JSON.parse(localStorage.getItem('corphaus_properties') || '[]');
    setProperties(storedProperties);
    setFilteredProperties(storedProperties);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = properties;

    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.streetAddress?.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.postcode?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
    }

    if (filters.minBedrooms > 0) {
      filtered = filtered.filter((p) => p.bedrooms >= filters.minBedrooms);
    }

    if (filters.businessModel) {
      filtered = filtered.filter((p) =>
        p.businessModels?.includes(filters.businessModel)
      );
    }

    if (filters.hasParking) {
      filtered = filtered.filter((p) => p.hasParking);
    }

    if (filters.wheelchairAccessible) {
      filtered = filtered.filter((p) => p.wheelchairAccessible);
    }

    if (filters.furnished) {
      filtered = filtered.filter((p) => p.furnished);
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

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
      propertyType: '',
      minBedrooms: 0,
      businessModel: '',
      hasParking: false,
      wheelchairAccessible: false,
      furnished: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Browse Properties
          </h1>
          <p className="text-gray-600">
            Find commercial properties suitable for your business needs
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
                placeholder="Search by location or postcode..."
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
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={filters.propertyType}
                      onChange={handleFilterChange}
                      className="input-field text-sm"
                    >
                      <option value="">All Types</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Bedrooms
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Model
                    </label>
                    <select
                      name="businessModel"
                      value={filters.businessModel}
                      onChange={handleFilterChange}
                      className="input-field text-sm"
                    >
                      <option value="">All Models</option>
                      {businessModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasParking"
                        checked={filters.hasParking}
                        onChange={handleFilterChange}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Has Parking</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="wheelchairAccessible"
                        checked={filters.wheelchairAccessible}
                        onChange={handleFilterChange}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Wheelchair Accessible</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="furnished"
                        checked={filters.furnished}
                        onChange={handleFilterChange}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Furnished</span>
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
                <span className="font-semibold text-gray-900">{filteredProperties.length}</span>{' '}
                {filteredProperties.length === 1 ? 'property' : 'properties'} found
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

            {/* Property Grid/List */}
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
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
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

