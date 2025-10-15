import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PaidFeatureGate } from '../components/PaidFeatureGate';
import { propertiesAPI, messagesAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
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
  Building
} from 'lucide-react';

export const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

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

  const handleSendMessage = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    if (!property?.userId) {
      alert('Unable to contact landlord at this time.');
      return;
    }

    // Don't let user message themselves
    if (property.userId === user._id) {
      alert("You can't send a message to yourself!");
      return;
    }

    setSendingMessage(true);

    try {
      // Send initial message
      const messageData = {
        recipientId: property.userId,
        content: `Hi, I'm interested in your property: ${property.propertyType} at ${property.streetAddress}, ${property.postcode}`,
        relatedPropertyId: property._id
      };

      const response = await messagesAPI.send(messageData, user._id);
      
      // Navigate to messages with this thread
      const threadId = response.data.threadId;
      navigate(`/messages?thread=${threadId}`);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

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
        <button
          onClick={() => navigate(-1)}
          className="text-primary-600 hover:text-primary-700 mb-6 flex items-center"
        >
          ← Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl aspect-video flex items-center justify-center">
              <Home className="w-24 h-24 text-primary-600 opacity-50" />
            </div>

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
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !user}
                    className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendingMessage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        {user ? 'Send Message' : 'Log in to Message'}
                      </>
                    )}
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
    </div>
  );
};

