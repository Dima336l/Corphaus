import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';

export const WantedAdCard = ({ ad }) => {
  return (
    <Link
      to={`/wanted-ads/${ad._id || ad.id}`}
      className="block h-full"
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-3 bg-primary-100 rounded-xl flex-shrink-0">
              <Briefcase className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">
                {ad.companyName || ad.businessName}
              </h3>
              <p className="text-sm font-medium text-primary-600">{ad.businessType}</p>
            </div>
          </div>
          {ad.maxBudget && (
            <div className="flex items-center text-primary-600 font-bold text-lg whitespace-nowrap ml-3">
              <DollarSign className="w-5 h-5 mr-1" />
              <span>£{ad.maxBudget}/mo</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="line-clamp-1">{ad.preferredLocation}</span>
        </div>

        {/* Property Details */}
        <div className="space-y-2 mb-4">
          {ad.minBedrooms > 0 && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Min Bedrooms:</span>{' '}
              <span className="text-gray-900">{ad.minBedrooms}+</span>
            </div>
          )}
          {ad.propertyType && ad.propertyType !== 'Any' && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Type:</span>{' '}
              <span className="text-gray-900">{ad.propertyType}</span>
            </div>
          )}
          {ad.useClass && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Use Class:</span>{' '}
              <span className="text-gray-900">{ad.useClass}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {ad.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
            {ad.description}
          </p>
        )}

        {/* Lease Length */}
        {ad.desiredLeaseLength && (
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{ad.desiredLeaseLength}</span>
          </div>
        )}

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 mt-auto">
          {ad.needsWheelchairAccessible && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Wheelchair Access
            </span>
          )}
          {ad.needsParking && (
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Parking Required
            </span>
          )}
          {ad.needsHMOLicence && (
            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              HMO Licence
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

