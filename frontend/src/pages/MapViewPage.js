import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import SearchFilters from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { MAPBOX_TOKEN, MAP_CONFIG } from '../config/config';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MapPinIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const MapViewPage = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  // Get initial filters from URL params
  const getFiltersFromParams = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === 'features') {
        filters[key] = searchParams.getAll(key);
      } else if (key === 'petFriendly' || key === 'furnished') {
        filters[key] = value === 'true';
      } else {
        filters[key] = value;
      }
    }
    return filters;
  };

  const [currentFilters, setCurrentFilters] = useState(getFiltersFromParams());

  // Load Mapbox or fallback
  useEffect(() => {
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your-mapbox-access-token-here' || MAPBOX_TOKEN.includes('demo')) {
      console.warn('Mapbox token not configured. Using fallback map implementation.');
      createFallbackMap();
      loadProperties();
      return;
    }

    // Dynamically import Mapbox GL
    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      if (map.current) return; // initialize map only once

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: MAP_CONFIG.style,
        center: MAP_CONFIG.defaultCenter,
        zoom: MAP_CONFIG.defaultZoom
      });

      map.current.addControl(new mapboxgl.default.NavigationControl());
      
      map.current.on('load', () => {
        loadProperties();
      });
    }).catch((error) => {
      console.error('Error loading Mapbox:', error);
      console.log('Falling back to simple map implementation');
      createFallbackMap();
      loadProperties();
    });

    return () => {
      if (map.current && map.current.remove) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Create fallback map when Mapbox is not available
  const createFallbackMap = () => {
    if (!mapContainer.current) return;
    
    mapContainer.current.innerHTML = `
      <div class="w-full h-full bg-gray-100 relative flex items-center justify-center">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
        <div class="relative z-10 text-center p-8">
          <div class="text-6xl mb-4">🗺️</div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
          <p class="text-gray-600 mb-4">Property locations will be displayed here</p>
          <div id="property-markers" class="space-y-2"></div>
        </div>
      </div>
    `;
  };

  // Load properties
  const loadProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        limit: 100, // Load more for map view
        status: 'available'
      };

      const response = await propertyService.getProperties(params);
      
      if (response.success) {
        setProperties(response.data.properties);
        updateMapMarkers(response.data.properties);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update map markers
  const updateMapMarkers = async (propertiesToShow) => {
    // Clear existing markers
    markers.current.forEach(marker => {
      if (marker.remove) {
        marker.remove();
      }
    });
    markers.current = [];

    // Fallback map implementation
    if (!map.current || !map.current.addTo) {
      updateFallbackMarkers(propertiesToShow);
      return;
    }

    try {
      const mapboxgl = await import('mapbox-gl');
      
      propertiesToShow.forEach((property) => {
        if (property.coordinates && property.coordinates.latitude && property.coordinates.longitude) {
          // Create marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.innerHTML = `
            <div class="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg cursor-pointer hover:bg-primary-700 transition-colors">
              ${propertyService.formatPrice(property.price)}
            </div>
          `;

          // Create marker
          const marker = new mapboxgl.default.Marker(markerElement)
            .setLngLat([property.coordinates.longitude, property.coordinates.latitude])
            .addTo(map.current);

          // Add click event
          markerElement.addEventListener('click', () => {
            setSelectedProperty(property);
            setShowSidebar(true);
            
            // Center map on property
            map.current.flyTo({
              center: [property.coordinates.longitude, property.coordinates.latitude],
              zoom: 15
            });
          });

          markers.current.push(marker);
        }
      });

      // Fit map to show all markers
      if (propertiesToShow.length > 0 && propertiesToShow.some(p => p.coordinates)) {
        const validProperties = propertiesToShow.filter(p => p.coordinates && p.coordinates.latitude && p.coordinates.longitude);
        
        if (validProperties.length > 1) {
          const bounds = new mapboxgl.default.LngLatBounds();
          validProperties.forEach(property => {
            bounds.extend([property.coordinates.longitude, property.coordinates.latitude]);
          });
          map.current.fitBounds(bounds, { padding: 50 });
        } else if (validProperties.length === 1) {
          const property = validProperties[0];
          map.current.flyTo({
            center: [property.coordinates.longitude, property.coordinates.latitude],
            zoom: 12
          });
        }
      }
    } catch (error) {
      console.error('Error updating map markers:', error);
      updateFallbackMarkers(propertiesToShow);
    }
  };

  // Update fallback markers
  const updateFallbackMarkers = (propertiesToShow) => {
    const markersContainer = document.getElementById('property-markers');
    if (!markersContainer) return;

    markersContainer.innerHTML = '';
    
    propertiesToShow.forEach((property, index) => {
      if (property.coordinates && property.coordinates.latitude && property.coordinates.longitude) {
        const markerDiv = document.createElement('div');
        markerDiv.className = 'bg-white rounded-lg shadow-md p-3 mb-2 cursor-pointer hover:shadow-lg transition-shadow';
        markerDiv.innerHTML = `
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-primary-600 rounded-full"></div>
            <div class="flex-1">
              <div class="font-medium text-gray-900">${property.title}</div>
              <div class="text-sm text-gray-600">${property.address}</div>
              <div class="text-sm font-semibold text-primary-600">${propertyService.formatPrice(property.price)}</div>
            </div>
          </div>
        `;
        
        markerDiv.addEventListener('click', () => {
          setSelectedProperty(property);
          setShowSidebar(true);
        });
        
        markersContainer.appendChild(markerDiv);
      }
    });
  };

  // Handle search
  const handleSearch = (filters) => {
    setCurrentFilters(filters);
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key])) {
        filters[key].forEach(value => {
          newParams.append(key, value);
        });
      } else {
        newParams.set(key, filters[key]);
      }
    });
    
    setSearchParams(newParams);
    loadProperties(filters);
  };

  const handleReset = () => {
    setCurrentFilters({});
    setSearchParams({});
    loadProperties();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/property-placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Map View</h1>
            <span className="text-sm text-gray-600">
              {properties.length} properties found
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-outline'}`}
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
              Filters
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`btn btn-sm ${showSidebar ? 'btn-primary' : 'btn-outline'}`}
            >
              <ListBulletIcon className="h-4 w-4 mr-1" />
              Properties
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <SearchFilters
            onSearch={handleSearch}
            onReset={handleReset}
            initialFilters={currentFilters}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Properties Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Properties</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4">
                  <LoadingSpinner className="mx-auto" />
                </div>
              ) : properties.length > 0 ? (
                <div className="space-y-4 p-4">
                  {properties.map((property) => (
                    <div
                      key={property._id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedProperty?._id === property._id 
                          ? 'ring-2 ring-primary-500 rounded-lg' 
                          : ''
                      }`}
                      onClick={() => {
                        setSelectedProperty(property);
                        if (property.coordinates && map.current) {
                          map.current.flyTo({
                            center: [property.coordinates.longitude, property.coordinates.latitude],
                            zoom: 15
                          });
                        }
                      }}
                    >
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-medium transition-shadow">
                        {/* Property Image */}
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={property.images?.[0] ? getImageUrl(property.images[0]) : '/images/property-placeholder.jpg'}
                            alt={property.title}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              e.target.src = '/images/property-placeholder.jpg';
                            }}
                          />
                        </div>
                        
                        {/* Property Info */}
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-primary-600">
                              {propertyService.formatPrice(property.price)}
                            </h3>
                            <span className="badge badge-blue text-xs">
                              {propertyService.getPropertyTypeLabel(property.type)}
                            </span>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                            {property.title}
                          </h4>
                          
                          <div className="flex items-center text-gray-600 text-xs mb-2">
                            <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{property.address}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                            <span>{propertyService.formatArea(property.area)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600 text-sm">
                    Try adjusting your search filters to see more results.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          {MAPBOX_TOKEN && MAPBOX_TOKEN !== 'your-mapbox-access-token-here' ? (
            <div ref={mapContainer} className="w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Map Not Available</h3>
                <p className="text-gray-600 max-w-md">
                  To enable map functionality, please configure your Mapbox access token in the environment variables.
                </p>
              </div>
            </div>
          )}

          {/* Property Detail Card (when property is selected) */}
          {selectedProperty && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              
              <PropertyCard 
                property={selectedProperty} 
                showStatus={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;
