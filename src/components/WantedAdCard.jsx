import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';

export const WantedAdCard = ({ ad }) => {
  return (
    <Link
      to={`/wanted-ads/${ad._id || ad.id}`}
      className="block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Briefcase className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {ad.companyName}
            </h3>
            <p className="text-sm text-gray-600">{ad.businessType}</p>
          </div>
        </div>
        {ad.maxBudget && (
          <div className="flex items-center text-primary-600 font-bold whitespace-nowrap ml-2">
            <DollarSign className="w-4 h-4" />
            <span>£{ad.maxBudget}/mo</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{ad.preferredLocation}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          {ad.minBedrooms > 0 && (
            <div>
              <span className="font-medium">Min Bedrooms:</span> {ad.minBedrooms}+
            </div>
          )}
          {ad.propertyType && (
            <div>
              <span className="font-medium">Type:</span> {ad.propertyType}
            </div>
          )}
          {ad.useClass && (
            <div className="col-span-2">
              <span className="font-medium">Use Class:</span> {ad.useClass}
            </div>
          )}
        </div>

        {ad.description && (
          <p className="text-sm text-gray-600 line-clamp-2 pt-2 border-t">
            {ad.description}
          </p>
        )}

        {ad.desiredLeaseLength && (
          <div className="flex items-center text-gray-500 text-xs pt-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{ad.desiredLeaseLength}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {ad.needsWheelchairAccessible && (
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
              Wheelchair Access
            </span>
          )}
          {ad.needsParking && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              Parking Required
            </span>
          )}
          {ad.needsHMOLicence && (
            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
              HMO Licence
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

