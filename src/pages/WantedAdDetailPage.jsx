import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PaidFeatureGate } from '../components/PaidFeatureGate';
import { wantedAdsAPI, messagesAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import ComposeMessageModal from '../components/ComposeMessageModal';
import { 
  MapPin, 
  Briefcase, 
  CheckCircle,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Calendar
} from 'lucide-react';

export const WantedAdDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const response = await wantedAdsAPI.getById(id);
        setAd(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching wanted ad:', err);
        setError('Wanted ad not found');
        // Navigate back to wanted ads page after a short delay
        setTimeout(() => {
          navigate('/wanted-ads');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id, navigate]);

  const handleOpenMessageModal = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    if (!ad?.userId) {
      alert('Unable to contact business at this time.');
      return;
    }

    // Don't let user message themselves
    if (ad.userId === user._id) {
      alert("You can't send a message to yourself!");
      return;
    }

    // Open the message modal
    setShowMessageModal(true);
  };

  const handleSendMessage = async (messageContent) => {
    try {
      // Send the user's message
      const messageData = {
        recipientId: ad.userId,
        content: messageContent,
        relatedWantedAdId: ad._id
      };

      const response = await messagesAPI.send(messageData, user._id);
      
      // Navigate to messages with this thread
      const threadId = response.data.threadId;
      navigate(`/messages?thread=${threadId}`);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
      throw err; // Re-throw so modal can handle it
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="text-gray-500 mt-4 text-lg">Loading wanted ad details...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || 'Wanted ad not found'}</div>
          <p className="text-gray-500 mb-4">Redirecting back to wanted ads...</p>
          <Link to="/wanted-ads" className="btn-primary">
            Back to Wanted Ads
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
          ← Back to wanted ads
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-4 bg-primary-100 rounded-xl">
                  <Briefcase className="w-10 h-10 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {ad.companyName}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building2 className="w-5 h-5 mr-2" />
                    <span className="font-semibold">{ad.businessType}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{ad.preferredLocation}</span>
                  </div>
                </div>
                {ad.maxBudget && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      £{ad.maxBudget}
                    </div>
                    <div className="text-gray-600">max / month</div>
                  </div>
                )}
              </div>

              {/* Requirements Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                {ad.minBedrooms > 0 && (
                  <div className="text-center">
                    <div className="font-semibold text-lg">{ad.minBedrooms}+</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                )}
                {ad.minEnSuites > 0 && (
                  <div className="text-center">
                    <div className="font-semibold text-lg">{ad.minEnSuites}+</div>
                    <div className="text-sm text-gray-600">En-Suites</div>
                  </div>
                )}
                {ad.minKitchens > 0 && (
                  <div className="text-center">
                    <div className="font-semibold text-lg">{ad.minKitchens}+</div>
                    <div className="text-sm text-gray-600">Kitchens</div>
                  </div>
                )}
                {ad.minReceptionRooms > 0 && (
                  <div className="text-center">
                    <div className="font-semibold text-lg">{ad.minReceptionRooms}+</div>
                    <div className="text-sm text-gray-600">Reception Rooms</div>
                  </div>
                )}
              </div>

              {/* Description */}
              {ad.description && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Requirements Details</h2>
                  <p className="text-gray-700 whitespace-pre-line">{ad.description}</p>
                </div>
              )}

              {/* Property Requirements */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Must-Have Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ad.needsParking && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Parking Required</span>
                    </div>
                  )}
                  {ad.needsOutdoorSpace && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Outdoor Space Needed</span>
                    </div>
                  )}
                  {ad.preferFurnished && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Prefer Furnished</span>
                    </div>
                  )}
                  {ad.needsWheelchairAccessible && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Wheelchair Accessible Required</span>
                    </div>
                  )}
                  {ad.needsAlterationsAllowed && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>Alterations Must Be Allowed</span>
                    </div>
                  )}
                  {ad.needsHMOLicence && (
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>HMO Licence Required ({ad.hmoLicenceFor} people)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-6 space-y-3">
                {ad.propertyType && (
                  <div>
                    <span className="font-semibold text-gray-700">Preferred Property Type:</span>
                    <span className="ml-2 text-gray-600">{ad.propertyType}</span>
                  </div>
                )}
                {ad.useClass && (
                  <div>
                    <span className="font-semibold text-gray-700">Required Use Class:</span>
                    <span className="ml-2 text-gray-600">{ad.useClass}</span>
                  </div>
                )}
                {ad.minEpcRating && (
                  <div>
                    <span className="font-semibold text-gray-700">Minimum EPC Rating:</span>
                    <span className="ml-2 text-gray-600">{ad.minEpcRating}</span>
                  </div>
                )}
                {ad.desiredLeaseLength && (
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="font-semibold mr-2">Desired Lease:</span>
                    <span className="text-gray-600">{ad.desiredLeaseLength}</span>
                  </div>
                )}
              </div>

              {/* Preferred Postcodes */}
              {ad.preferredPostcodes && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Preferred Postcodes</h2>
                  <div className="flex flex-wrap gap-2">
                    {ad.preferredPostcodes.split(',').map((postcode, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {postcode.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Business Contact</h2>
              
              <PaidFeatureGate feature="Contact Details">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Business</div>
                      <div className="font-semibold">{ad.companyName}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <a
                        href={`mailto:${ad.businessEmail}`}
                        className="font-semibold text-primary-600 hover:text-primary-700"
                      >
                        {ad.businessEmail}
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

              <div className="mt-6 pt-6 border-t space-y-3">
                {ad.maxBudget && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max Budget</span>
                    <span className="font-semibold">£{ad.maxBudget}/mo</span>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Posted {new Date(ad.createdAt).toLocaleDateString()}
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
        recipientName={ad?.companyName || 'Business'}
        defaultMessage={`Hi, I'm interested in your wanted ad: ${ad?.companyName} looking for ${ad?.businessType} in ${ad?.preferredLocation}`}
      />
    </div>
  );
};

