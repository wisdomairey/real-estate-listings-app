import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  MapPinIcon,
  HomeIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon,
  HeartIcon,
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const response = await propertyService.getProperty(id);
        
        if (response.success) {
          setProperty(response.data.property);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('Error loading property:', error);
        toast.error('Property not found');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id, navigate]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/property-placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <Link to="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = propertyService.getPropertyStatusInfo(property.status);
  const typeLabel = propertyService.getPropertyTypeLabel(property.type);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Properties
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              {property.images && property.images.length > 0 ? (
                <div className="relative">
                  <div 
                    className="aspect-w-16 aspect-h-9 cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  >
                    <img
                      src={getImageUrl(property.images[currentImageIndex])}
                      alt={property.title}
                      className="w-full h-96 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/property-placeholder.jpg';
                      }}
                    />
                  </div>

                  {/* Image Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                    </>
                  )}

                  {/* Thumbnail Strip */}
                  {property.images.length > 1 && (
                    <div className="flex space-x-2 mt-4 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex 
                              ? 'border-primary-500' 
                              : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`${property.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center">
                  <CameraIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{property.address}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFavoriteToggle}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ShareIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {propertyService.formatPrice(property.price)}
                  </span>
                  <span className={`badge property-status-${property.status}`}>
                    {statusInfo.label}
                  </span>
                  <span className="badge badge-blue">
                    {typeLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <HomeIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-gray-600">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🚿</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-gray-600">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">📐</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.area.toLocaleString()}</div>
                  <div className="text-gray-600">Sq Ft</div>
                </div>
                {property.parkingSpaces > 0 && (
                  <div className="text-center">
                    <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🚗</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{property.parkingSpaces}</div>
                    <div className="text-gray-600">Parking</div>
                  </div>
                )}
              </div>

              {/* Additional Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.yearBuilt && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Built in {property.yearBuilt}</span>
                  </div>
                )}
                {property.petFriendly && (
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🐕</span>
                    <span className="text-gray-600">Pet Friendly</span>
                  </div>
                )}
                {property.furnished && (
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🪑</span>
                    <span className="text-gray-600">Furnished</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            {property.contactInfo && (
              <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h3>
                
                <div className="space-y-4">
                  {property.contactInfo.agentName && (
                    <div>
                      <div className="font-medium text-gray-900">
                        {property.contactInfo.agentName}
                      </div>
                      <div className="text-gray-600">Licensed PropertyHub Agent</div>
                    </div>
                  )}
                  
                  {property.contactInfo.agentPhone && (
                    <a
                      href={`tel:${property.contactInfo.agentPhone}`}
                      className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <PhoneIcon className="h-5 w-5 text-primary-600 mr-3" />
                      <span className="text-primary-600 font-medium">
                        {property.contactInfo.agentPhone}
                      </span>
                    </a>
                  )}
                  
                  {property.contactInfo.agentEmail && (
                    <a
                      href={`mailto:${property.contactInfo.agentEmail}`}
                      className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <EnvelopeIcon className="h-5 w-5 text-primary-600 mr-3" />
                      <span className="text-primary-600 font-medium">
                        {property.contactInfo.agentEmail}
                      </span>
                    </a>
                  )}
                  
                  <button className="w-full btn btn-primary">
                    Request Viewing
                  </button>
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive map coming soon</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 text-sm">{property.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && property.images && property.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity z-10"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <img
              src={getImageUrl(property.images[currentImageIndex])}
              alt={property.title}
              className="w-full h-auto max-h-screen object-contain"
            />
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity"
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
