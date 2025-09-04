import React from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import {
  HomeIcon,
  MapPinIcon,
  PhotoIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PropertyCard = ({ property, showStatus = true, onFavorite }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const statusInfo = propertyService.getPropertyStatusInfo(property.status);
  const typeLabel = propertyService.getPropertyTypeLabel(property.type);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavorite) {
      onFavorite(property._id, !isFavorite);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/property-placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const mainImage = property.images && property.images.length > 0 
    ? getImageUrl(property.images[0])
    : '/images/property-placeholder.jpg';

  return (
    <div className="property-card group">
      <Link to={`/properties/${property._id}`} className="block">
        {/* Image section */}
        <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/images/property-placeholder.jpg';
            }}
          />
          
          {/* Status badge */}
          {showStatus && (
            <div className="absolute top-3 left-3">
              <span className={`badge property-status-${property.status}`}>
                {statusInfo.label}
              </span>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200"
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Image count */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              <PhotoIcon className="h-3 w-3 mr-1" />
              {property.images.length}
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4">
          {/* Price and type */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {propertyService.formatPrice(property.price)}
            </h3>
            <span className="badge badge-blue">
              {typeLabel}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-lg font-medium text-gray-900 mb-2 text-ellipsis-2 leading-tight">
            {property.title}
          </h4>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm text-ellipsis">{property.address}</span>
          </div>

          {/* Property details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <HomeIcon className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              <div className="flex items-center">
                <span>🚿</span>
                <span className="ml-1">{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="text-gray-500">
              {propertyService.formatArea(property.area)}
            </div>
          </div>

          {/* Features preview */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Description preview */}
          <p className="text-gray-600 text-sm text-ellipsis-2 leading-relaxed">
            {property.description}
          </p>

          {/* Agent info */}
          {property.contactInfo && property.contactInfo.agentName && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Listed by {property.contactInfo.agentName}</span>
                <span>
                  {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
