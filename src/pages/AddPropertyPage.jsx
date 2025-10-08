import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
import { Home, MapPin, DollarSign, Upload } from 'lucide-react';

export const AddPropertyPage = () => {
  const { user, isPaid } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyType: '',
    bedrooms: 0,
    enSuites: 0,
    studioRooms: 0,
    kitchens: 0,
    receptionRooms: 0,
    hasOutdoorSpace: false,
    hasParking: false,
    streetAddress: '',
    postcode: '',
    useClass: '',
    alterationsAllowed: false,
    businessModels: [],
    epcRating: '',
    furnished: false,
    wheelchairAccessible: false,
    hasHMOLicence: false,
    hmoLicenceFor: 0,
    desiredRent: '',
    leaseLength: '',
    description: '',
    photos: [],
    floorPlan: null,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleBusinessModelToggle = (model) => {
    setFormData({
      ...formData,
      businessModels: formData.businessModels.includes(model)
        ? formData.businessModels.filter((m) => m !== model)
        : [...formData.businessModels, model],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.propertyType || !formData.streetAddress || !formData.postcode) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.businessModels.length === 0) {
      setError('Please select at least one business model');
      return;
    }

    // Check if user has reached free listing limit
    const existingListings = JSON.parse(localStorage.getItem('corphaus_properties') || '[]');
    const userListings = existingListings.filter(l => l.userId === user?.id);
    
    if (!isPaid && userListings.length >= 1) {
      if (!window.confirm('Free users can only post one listing. Upgrade to a paid plan for unlimited listings. Redirect to pricing page?')) {
        return;
      }
      navigate('/pricing');
      return;
    }

    // Save property
    const newProperty = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id,
      landlordName: user?.name,
      landlordEmail: user?.email,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const updatedListings = [...existingListings, newProperty];
    localStorage.setItem('corphaus_properties', JSON.stringify(updatedListings));

    alert('Property listed successfully!');
    navigate('/landlord/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Home className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
          </div>

          {!isPaid && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Free Plan:</strong> You can post 1 property listing. 
                <a href="/pricing" className="text-primary-600 hover:text-primary-700 font-semibold ml-1">
                  Upgrade for unlimited listings
                </a>
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Type Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Use Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="useClass"
                    value={formData.useClass}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select use class</option>
                    {useClasses.map((uc) => (
                      <option key={uc} value={uc}>{uc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Bedrooms
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {bedroomOptions.map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    En-Suites
                  </label>
                  <select
                    name="enSuites"
                    value={formData.enSuites}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {bathroomOptions.map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Studio Rooms
                  </label>
                  <select
                    name="studioRooms"
                    value={formData.studioRooms}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {bedroomOptions.map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kitchens
                  </label>
                  <select
                    name="kitchens"
                    value={formData.kitchens}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {kitchenOptions.map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reception Rooms
                  </label>
                  <select
                    name="receptionRooms"
                    value={formData.receptionRooms}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {receptionOptions.map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EPC Rating
                  </label>
                  <select
                    name="epcRating"
                    value={formData.epcRating}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select rating</option>
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
                    name="hasOutdoorSpace"
                    checked={formData.hasOutdoorSpace}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Has Outdoor Space</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="hasParking"
                    checked={formData.hasParking}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Has Parking</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Furnished</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="wheelchairAccessible"
                    checked={formData.wheelchairAccessible}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Wheelchair Accessible</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="alterationsAllowed"
                    checked={formData.alterationsAllowed}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Alterations Allowed</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="hasHMOLicence"
                    checked={formData.hasHMOLicence}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Has HMO Licence</span>
                </label>
              </div>

              {formData.hasHMOLicence && (
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
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="SW1A 1AA"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Business Models Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Accepted Business Models <span className="text-red-500">*</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {businessModels.map((model) => (
                  <label
                    key={model}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.businessModels.includes(model)
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.businessModels.includes(model)}
                      onChange={() => handleBusinessModelToggle(model)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700 font-medium">{model}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Financial Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-primary-600" />
                Lease Terms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Monthly Rent (£)
                  </label>
                  <input
                    type="number"
                    name="desiredRent"
                    value={formData.desiredRent}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Lease Length
                  </label>
                  <select
                    name="leaseLength"
                    value={formData.leaseLength}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select length</option>
                    {leaseLengths.map((length) => (
                      <option key={length} value={length}>{length}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="input-field"
                  placeholder="Describe your property, any special features, nearby amenities, etc."
                ></textarea>
              </div>
            </section>

            {/* Photos Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-6 h-6 mr-2 text-primary-600" />
                Photos & Documents
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Photos
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload up to 10 photos (JPG, PNG)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Plan (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload floor plan (JPG, PNG, or PDF)</p>
                </div>
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
              >
                List Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

