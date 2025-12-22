import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { propertiesAPI } from '../utils/api';
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
import { Home, MapPin, DollarSign, Upload, X } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Helper function to compress/resize image
  const compressImage = (file, maxWidth = 1920, maxHeight = 1920, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const reader2 = new FileReader();
              reader2.onload = () => resolve(reader2.result);
              reader2.onerror = () => reject(new Error('Failed to read compressed image'));
              reader2.readAsDataURL(blob);
            },
            file.type || 'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 10 photos
    const photosToProcess = files.slice(0, 10 - formData.photos.length);
    
    if (photosToProcess.length === 0) {
      setError('Maximum 10 photos allowed');
      return;
    }

    // Convert files to compressed base64 data URLs
    const photoPromises = photosToProcess.map((file) => {
      return new Promise(async (resolve, reject) => {
        try {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            reject(new Error(`${file.name} is not an image file`));
            return;
          }

          // Validate file size (max 5MB per image before compression)
          if (file.size > 5 * 1024 * 1024) {
            reject(new Error(`${file.name} is too large (max 5MB)`));
            return;
          }

          // Compress image before converting to base64
          const compressedDataUrl = await compressImage(file, 1920, 1920, 0.85);
          resolve(compressedDataUrl);
        } catch (error) {
          reject(error);
        }
      });
    });

    try {
      const photoDataUrls = await Promise.all(photoPromises);
      setFormData({
        ...formData,
        photos: [...formData.photos, ...photoDataUrls].slice(0, 10), // Keep max 10 photos
      });
    } catch (error) {
      setError(error.message || 'Error processing photos');
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index),
    });
  };

  const handleFloorPlanChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB for floor plan)
    if (file.size > 10 * 1024 * 1024) {
      setError('Floor plan file is too large (max 10MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({
        ...formData,
        floorPlan: e.target.result,
      });
    };
    reader.onerror = () => {
      setError('Error reading floor plan file');
    };
    reader.readAsDataURL(file);
  };

  const handleBusinessModelToggle = (model) => {
    setFormData({
      ...formData,
      businessModels: formData.businessModels.includes(model)
        ? formData.businessModels.filter((m) => m !== model)
        : [...formData.businessModels, model],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.propertyType || !formData.streetAddress || !formData.postcode) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.businessModels.length === 0) {
      setError('Please select at least one business model');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('You must be logged in to list a property');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      // Check if user has reached free listing limit by fetching their properties from API
      if (!isPaid) {
        try {
          const myListingsResponse = await propertiesAPI.getMyListings(user.id);
          const userListings = myListingsResponse.data || [];
          
          if (userListings.length >= 1) {
            setError('You have reached your free listing limit of 1 property. Please upgrade to Pro for unlimited listings.');
            setLoading(false);
            return;
          }
        } catch (err) {
          // If API call fails, we'll still try to create the property
          // The backend will handle the limit check
          console.warn('Could not check existing listings:', err);
        }
      }

      // Validate user has required fields
      if (!user.name || !user.email) {
        setError('User profile is incomplete. Please ensure you have a name and email.');
        setLoading(false);
        return;
      }

      // Prepare property data
      const propertyData = {
        landlordName: user.name,
        landlordEmail: user.email,
        ...formData,
        // Convert numbers to integers
        bedrooms: parseInt(formData.bedrooms) || 0,
        enSuites: parseInt(formData.enSuites) || 0,
        studioRooms: parseInt(formData.studioRooms) || 0,
        kitchens: parseInt(formData.kitchens) || 0,
        receptionRooms: parseInt(formData.receptionRooms) || 0,
        hmoLicenceFor: parseInt(formData.hmoLicenceFor) || 0,
      };

      // Validate required fields are present
      if (!propertyData.useClass) {
        setError('Please select a use class for the property.');
        setLoading(false);
        return;
      }

      console.log('Creating property with data:', propertyData);
      console.log('User ID:', user.id || user._id);

      // Save property via API
      const userId = user.id || user._id;
      if (!userId) {
        setError('User ID is missing. Please log out and log back in.');
        setLoading(false);
        return;
      }

      const response = await propertiesAPI.create(propertyData, userId);
      
      if (response.success) {
        navigate('/landlord/dashboard');
      } else {
        // Format error message nicely
        let errorMessage = response.message || 'Failed to create property listing';
        
        // If there are validation details, format them nicely
        if (response.details && Array.isArray(response.details)) {
          const formattedErrors = response.details.map(detail => 
            `• ${detail.fieldName || detail.field}: ${detail.message}`
          ).join('\n');
          errorMessage = formattedErrors;
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error creating property:', err);
      
      // Try to extract user-friendly error from response
      let errorMessage = 'Failed to create property listing. Please try again.';
      
      if (err.message) {
        // Check if error message contains validation details
        if (err.message.includes('Validation error') || err.message.includes('Details:')) {
          // Try to parse the details from the error message
          try {
            const errorText = err.message;
            // Extract the details part if present
            const detailsMatch = errorText.match(/Details:\s*(\[.*\])/);
            if (detailsMatch) {
              const details = JSON.parse(detailsMatch[1]);
              errorMessage = details.map(d => 
                `• ${d.fieldName || d.field}: ${d.message}`
              ).join('\n');
            } else {
              // Use the message as-is if it's already formatted
              errorMessage = errorText.replace(/Validation error\s*Details:\s*/, '');
            }
          } catch (parseError) {
            // If parsing fails, use the original message
            errorMessage = err.message.replace(/Details:\s*\[.*\]/, '').trim();
          }
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Full error details:', err);
    } finally {
      setLoading(false);
    }
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 whitespace-pre-line">
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
                    Property Photos {formData.photos.length > 0 && `(${formData.photos.length}/10)`}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={formData.photos.length >= 10}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload up to 10 photos (JPG, PNG, max 5MB each)
                  </p>

                  {/* Photo Preview */}
                  {formData.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Property photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Plan (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFloorPlanChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload floor plan (JPG, PNG, or PDF, max 10MB)
                  </p>
                  {formData.floorPlan && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600 mb-2">✓ Floor plan uploaded</p>
                      {formData.floorPlan.startsWith('data:image/') && (
                        <img
                          src={formData.floorPlan}
                          alt="Floor plan"
                          className="max-w-md h-auto rounded-lg border border-gray-200"
                        />
                      )}
                    </div>
                  )}
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
                disabled={loading}
              >
                {loading ? 'Listing...' : 'List Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

