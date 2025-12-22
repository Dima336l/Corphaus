import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Home, CheckCircle, DollarSign } from 'lucide-react';

export const PropertyCard = ({ property }) => {
  return (
    <Link
      to={`/properties/${property._id || property.id}`}
      className="block h-full"
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-[2/1] rounded-lg mb-4 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
          {property.photos && property.photos.length > 0 && property.photos[0] ? (
            <img
              src={property.photos[0]}
              alt={property.propertyType}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-8 h-8 text-primary-600 opacity-60" />
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">
              {property.propertyType}
            </h3>
            <p className="text-sm font-medium text-primary-600">{property.postcode}</p>
          </div>
          {property.desiredRent && (
            <div className="flex items-center text-primary-600 font-bold text-lg whitespace-nowrap ml-3">
              <DollarSign className="w-5 h-5 mr-1" />
              <span>£{property.desiredRent}/mo</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="line-clamp-1">{property.streetAddress}</span>
        </div>

        {/* Property Details */}
        <div className="space-y-2 mb-4">
          {property.bedrooms > 0 && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Bedrooms:</span>{' '}
              <span className="text-gray-900">{property.bedrooms}</span>
            </div>
          )}
          {property.enSuites > 0 && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">En-Suites:</span>{' '}
              <span className="text-gray-900">{property.enSuites}</span>
            </div>
          )}
          {property.useClass && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Use Class:</span>{' '}
              <span className="text-gray-900">{property.useClass}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {property.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
            {property.description}
          </p>
        )}

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 mt-auto">
          {property.businessModels?.slice(0, 2).map((model) => (
            <span
              key={model}
              className="px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
            >
              {model}
            </span>
          ))}
          {property.businessModels?.length > 2 && (
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{property.businessModels.length - 2} more
            </span>
          )}
          {property.hasParking && (
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Parking
            </span>
          )}
          {property.wheelchairAccessible && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Wheelchair Access
            </span>
          )}
          {property.hasHMOLicence && (
            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              HMO Licence
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

