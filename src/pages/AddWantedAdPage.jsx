import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { wantedAdsAPI } from '../utils/api';
import { 
  propertyTypes, 
  useClasses, 
  businessModels, 
  epcRatings,
  bedroomOptions,
  bathroomOptions,
  receptionOptions,
  kitchenOptions,
  hmoLicenceOptions,
  leaseLengths
} from '../data/formOptions';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';

export const AddWantedAdPage = () => {
  const { user, isPaid } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessType: '',
    propertyType: '',
    minBedrooms: 0,
    minEnSuites: 0,
    minStudioRooms: 0,
    minKitchens: 0,
    minReceptionRooms: 0,
    needsOutdoorSpace: false,
    needsParking: false,
    preferredLocation: '',
    preferredPostcodes: '',
    useClass: '',
    needsAlterationsAllowed: false,
    minEpcRating: '',
    preferFurnished: false,
    needsWheelchairAccessible: false,
    needsHMOLicence: false,
    hmoLicenceFor: 0,
    maxBudget: '',
    desiredLeaseLength: '',
    description: '',
    companyName: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.businessType || !formData.preferredLocation || !formData.companyName) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('You must be logged in to post a wanted ad');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      // Check if user has reached free listing limit
      if (!isPaid) {
        try {
          const myListingsResponse = await wantedAdsAPI.getMyListings(user.id);
          const userAds = myListingsResponse.data || [];
          
          if (userAds.length >= 1) {
            setError('You have reached your free listing limit of 1 wanted ad. Please upgrade to Pro for unlimited wanted ads.');
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Could not check existing listings:', err);
        }
      }

      // Validate user has required fields
      if (!user.name || !user.email) {
        setError('User profile is incomplete. Please ensure you have a name and email.');
        setLoading(false);
        return;
      }

      // Prepare wanted ad data
      const adData = {
        companyName: formData.companyName,
        businessName: formData.companyName, // Model requires both, use companyName for both
        businessEmail: user.email,
        businessType: formData.businessType,
        preferredLocation: formData.preferredLocation,
        preferredPostcodes: formData.preferredPostcodes || '',
        ...formData,
        // Convert numbers to integers
        minBedrooms: parseInt(formData.minBedrooms) || 0,
        minEnSuites: parseInt(formData.minEnSuites) || 0,
        minStudioRooms: parseInt(formData.minStudioRooms) || 0,
        minKitchens: parseInt(formData.minKitchens) || 0,
        minReceptionRooms: parseInt(formData.minReceptionRooms) || 0,
        hmoLicenceFor: parseInt(formData.hmoLicenceFor) || 0,
      };

      // Save wanted ad via API
      const userId = user.id || user._id;
      if (!userId) {
        setError('User ID is missing. Please log out and log back in.');
        setLoading(false);
        return;
      }

      const response = await wantedAdsAPI.create(adData, userId);
      
      if (response.success) {
        navigate('/business/dashboard');
      } else {
        setError(response.message || 'Failed to create wanted ad');
      }
    } catch (err) {
      console.error('Error creating wanted ad:', err);
      setError(err.message || 'Failed to create wanted ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Briefcase className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Post Wanted Ad</h1>
          </div>

          <p className="text-gray-600 mb-6">
            Tell landlords what kind of property you're looking for and they can reach out to you.
          </p>

          {!isPaid && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Free Plan:</strong> You can post 1 wanted ad. 
                <a href="/pricing" className="text-primary-600 hover:text-primary-700 font-semibold ml-1">
                  Upgrade for unlimited ads
                </a>
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your Business Ltd."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type / Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select business type</option>
                    {businessModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Property Requirements */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Use Class
                  </label>
                  <select
                    name="useClass"
                    value={formData.useClass}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    {useClasses.map((uc) => (
                      <option key={uc} value={uc}>{uc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Bedrooms
                  </label>
                  <select
                    name="minBedrooms"
                    value={formData.minBedrooms}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {bedroomOptions.map((num) => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum En-Suites
                  </label>
                  <select
                    name="minEnSuites"
                    value={formData.minEnSuites}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {bathroomOptions.map((num) => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Studio Rooms
                  </label>
                  <select
                    name="minStudioRooms"
                    value={formData.minStudioRooms}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {bedroomOptions.map((num) => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Kitchens
                  </label>
                  <select
                    name="minKitchens"
                    value={formData.minKitchens}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {kitchenOptions.map((num) => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Reception Rooms
                  </label>
                  <select
                    name="minReceptionRooms"
                    value={formData.minReceptionRooms}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {receptionOptions.map((num) => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum EPC Rating
                  </label>
                  <select
                    name="minEpcRating"
                    value={formData.minEpcRating}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    {epcRatings.map((rating) => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="needsOutdoorSpace"
                    checked={formData.needsOutdoorSpace}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Needs Outdoor Space</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="needsParking"
                    checked={formData.needsParking}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Needs Parking</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="preferFurnished"
                    checked={formData.preferFurnished}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Prefer Furnished</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="needsWheelchairAccessible"
                    checked={formData.needsWheelchairAccessible}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Needs Wheelchair Accessible</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="needsAlterationsAllowed"
                    checked={formData.needsAlterationsAllowed}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Needs Alterations Allowed</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="needsHMOLicence"
                    checked={formData.needsHMOLicence}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Needs HMO Licence</span>
                </label>
              </div>

              {formData.needsHMOLicence && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HMO Licence For How Many People?
                  </label>
                  <select
                    name="hmoLicenceFor"
                    value={formData.hmoLicenceFor}
                    onChange={handleChange}
                    className="input-field max-w-xs"
                  >
                    {hmoLicenceOptions.map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              )}
            </section>

            {/* Location Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-primary-600" />
                Preferred Location
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City / Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. London, Manchester, Birmingham"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Postcodes (Optional)
                  </label>
                  <input
                    type="text"
                    name="preferredPostcodes"
                    value={formData.preferredPostcodes}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. SW1, W1, EC1 (comma-separated)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter specific postcode areas, separated by commas
                  </p>
                </div>
              </div>
            </section>

            {/* Budget & Lease Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-primary-600" />
                Budget & Lease Terms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Monthly Budget (£)
                  </label>
                  <input
                    type="number"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Lease Length
                  </label>
                  <select
                    name="desiredLeaseLength"
                    value={formData.desiredLeaseLength}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    {leaseLengths.map((length) => (
                      <option key={length} value={length}>{length}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Requirements
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="input-field"
                  placeholder="Describe your specific requirements, any special needs, timeline, etc."
                ></textarea>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Wanted Ad'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

