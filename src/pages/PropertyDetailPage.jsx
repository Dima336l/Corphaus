import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PaidFeatureGate } from '../components/PaidFeatureGate';
import { propertiesAPI, messagesAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import ComposeMessageModal from '../components/ComposeMessageModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Trees, 
  Accessibility,
  CheckCircle,
  Mail,
  Phone,
  User,
  DollarSign,
  Calendar,
  Building,
  Trash2
} from 'lucide-react';

export const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getById(id);
        setProperty(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Property not found');
        // Navigate back to properties page after a short delay
        setTimeout(() => {
          navigate('/properties');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleOpenMessageModal = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    if (!property?.userId) {
      console.warn('Unable to contact landlord: userId is missing');
      return;
    }

    // Check if this is a real user (not marketplace/seed data)
    if (property.userId === 'marketplace' || property.userId.length < 20) {
      console.warn('This is a marketplace listing. Messaging is only available for user-owned properties.');
      return;
    }

    // Don't let user message themselves
    if (property.userId === user._id || property.userId === user.id) {
      console.warn("Cannot send message to yourself");
      return;
    }

    // Open the message modal
    setShowMessageModal(true);
  };

  const handleSendMessage = async (messageContent) => {
    try {
      // Send the user's message
      const messageData = {
        recipientId: property.userId,
        content: messageContent,
        relatedPropertyId: property._id
      };

      const response = await messagesAPI.send(messageData, user._id);
      
      // Navigate to messages with this thread
      const threadId = response.data.threadId;
      navigate(`/messages?thread=${threadId}`);
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err; // Re-throw so modal can handle it
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await propertiesAPI.delete(id, user._id || user.id);
      navigate('/landlord/dashboard');
    } catch (err) {
      console.error('Failed to delete property:', err);
      setError(err.message || 'Failed to delete property. Please try again.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isOwner = user && property && (property.userId === user._id || property.userId === user.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="text-gray-500 mt-4 text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || 'Property not found'}</div>
          <p className="text-gray-500 mb-4">Redirecting back to properties...</p>
          <Link to="/properties" className="btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 flex items-center"
          >
            ← Back to listings
          </button>
          {isOwner && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Property</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {property.photos && property.photos.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={property.photos[0]}
                    alt={property.propertyType}
                    className="w-full h-auto max-h-96 object-cover"
                    onError={(e) => {
                      // Hide broken image and show placeholder
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.className = 'bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl aspect-video flex items-center justify-center';
                      parent.innerHTML = '';
                      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                      icon.setAttribute('class', 'w-24 h-24 text-primary-600 opacity-50');
                      icon.setAttribute('fill', 'none');
                      icon.setAttribute('stroke', 'currentColor');
                      icon.setAttribute('viewBox', '0 0 24 24');
                      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                      path.setAttribute('stroke-linecap', 'round');
                      path.setAttribute('stroke-linejoin', 'round');
                      path.setAttribute('stroke-width', '2');
                      path.setAttribute('d', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6');
                      icon.appendChild(path);
                      parent.appendChild(icon);
                    }}
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                {property.photos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.photos.slice(1, 5).map((photo, index) => (
                      <div key={index} className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
                        <img
                          src={photo}
                          alt={`${property.propertyType} photo ${index + 2}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.className = 'rounded-lg bg-gray-200 flex items-center justify-center aspect-square';
                            e.target.parentElement.innerHTML = '<span class="text-gray-400 text-xs">Failed to load</span>';
                          }}
                        />
                      </div>
                    ))}
                    {property.photos.length > 5 && (
                      <div className="rounded-lg bg-gray-200 flex items-center justify-center aspect-square text-gray-600 font-semibold">
                        +{property.photos.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl aspect-video flex items-center justify-center">
                <Home className="w-24 h-24 text-primary-600 opacity-50" />
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.propertyType}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.streetAddress}, {property.postcode}</span>
                  </div>
                </div>
                {property.desiredRent && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      £{property.desiredRent}
                    </div>
                    <div className="text-gray-600">per month</div>
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                <div className="text-center">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <div className="font-semibold">{property.enSuites}</div>
                  <div className="text-sm text-gray-600">En-Suites</div>
                </div>
                <div className="text-center">
                  <Home className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <div className="font-semibold">{property.receptionRooms}</div>
                  <div className="text-sm text-gray-600">Reception</div>
                </div>
                <div className="text-center">
                  <Building className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <div className="font-semibold">{property.kitchens}</div>
                  <div className="text-sm text-gray-600">Kitchens</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Property Features */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Property Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.hasParking && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Parking Available</span>
                    </div>
                  )}
                  {property.hasOutdoorSpace && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Outdoor Space</span>
                    </div>
                  )}
                  {property.furnished && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Furnished</span>
                    </div>
                  )}
                  {property.wheelchairAccessible && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Wheelchair Accessible</span>
                    </div>
                  )}
                  {property.alterationsAllowed && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Alterations Allowed</span>
                    </div>
                  )}
                  {property.hasHMOLicence && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>HMO Licence ({property.hmoLicenceFor} people)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.useClass && (
                  <div>
                    <span className="font-semibold text-gray-700">Use Class:</span>
                    <span className="ml-2 text-gray-600">{property.useClass}</span>
                  </div>
                )}
                {property.epcRating && (
                  <div>
                    <span className="font-semibold text-gray-700">EPC Rating:</span>
                    <span className="ml-2 text-gray-600">{property.epcRating}</span>
                  </div>
                )}
                {property.leaseLength && (
                  <div>
                    <span className="font-semibold text-gray-700">Lease Length:</span>
                    <span className="ml-2 text-gray-600">{property.leaseLength}</span>
                  </div>
                )}
              </div>

              {/* Business Models */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Accepted Business Models</h2>
                <div className="flex flex-wrap gap-2">
                  {property.businessModels?.map((model) => (
                    <span
                      key={model}
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-medium"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Landlord Contact</h2>
              
              <PaidFeatureGate feature="Contact Details">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Landlord</div>
                      <div className="font-semibold">{property.landlordName}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <a
                        href={`mailto:${property.landlordEmail}`}
                        className="font-semibold text-primary-600 hover:text-primary-700"
                      >
                        {property.landlordEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <a
                        href="tel:+447123456789"
                        className="font-semibold text-primary-600 hover:text-primary-700"
                      >
                        +44 7123 456 789
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenMessageModal}
                    disabled={!user}
                    className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {user ? 'Send Message' : 'Log in to Message'}
                  </button>
                </div>
              </PaidFeatureGate>

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Listed {new Date(property.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      <ComposeMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSend={handleSendMessage}
        recipientName={property?.landlordName || 'Landlord'}
        defaultMessage={`Hi, I'm interested in your property: ${property?.propertyType} at ${property?.streetAddress}, ${property?.postcode}`}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Property"
        message={`Are you sure you want to delete this property?`}
        itemName={`${property?.propertyType} at ${property?.postcode}`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

