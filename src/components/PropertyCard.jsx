import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Home, CheckCircle } from 'lucide-react';

export const PropertyCard = ({ property }) => {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="card block hover:scale-[1.02] transition-transform"
    >
      <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
        <Home className="w-16 h-16 text-primary-600 opacity-50" />
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.propertyType} - {property.postcode}
          </h3>
          {property.desiredRent && (
            <span className="text-primary-600 font-bold whitespace-nowrap ml-2">
              £{property.desiredRent}/mo
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.streetAddress}</span>
        </div>

        <div className="flex items-center space-x-4 text-gray-600 text-sm">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.enSuites} bath</span>
          </div>
          {property.hasParking && (
            <span className="text-primary-600 text-xs font-medium">Parking</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {property.businessModels?.slice(0, 2).map((model) => (
            <span
              key={model}
              className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
            >
              {model}
            </span>
          ))}
          {property.businessModels?.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{property.businessModels.length - 2} more
            </span>
          )}
        </div>

        {property.wheelchairAccessible && (
          <div className="flex items-center text-green-600 text-sm pt-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Wheelchair Accessible</span>
          </div>
        )}
      </div>
    </Link>
  );
};

