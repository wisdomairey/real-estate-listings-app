const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://propertyhub-yzax.onrender.com/api'
    : 'http://localhost:5000/api');

// Mapbox configuration - Using a demo token for development
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrcXVrY2QyMjBzeTkydm51M3YyYjhlaXMifQ.abc123_demo_token';

// Map default settings
export const MAP_CONFIG = {
  defaultCenter: [-73.9857, 40.7484], // New York City
  defaultZoom: 11,
  style: 'mapbox://styles/mapbox/streets-v12'
};

// Pagination defaults
export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 50
};

// Property types and statuses
export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' }
];

export const PROPERTY_STATUSES = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'sold', label: 'Sold', color: 'red' },
  { value: 'rented', label: 'Rented', color: 'blue' }
];

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under $200K', min: 0, max: 200000 },
  { label: '$200K - $400K', min: 200000, max: 400000 },
  { label: '$400K - $600K', min: 400000, max: 600000 },
  { label: '$600K - $800K', min: 600000, max: 800000 },
  { label: '$800K - $1M', min: 800000, max: 1000000 },
  { label: '$1M - $2M', min: 1000000, max: 2000000 },
  { label: 'Over $2M', min: 2000000, max: null }
];

// Common features for properties
export const COMMON_FEATURES = [
  'Swimming Pool',
  'Garage',
  'Balcony',
  'Garden',
  'Fireplace',
  'Gym',
  'Laundry Room',
  'Walk-in Closet',
  'Hardwood Floors',
  'Granite Countertops',
  'Stainless Steel Appliances',
  'Central Air Conditioning',
  'Security System',
  'Elevator',
  'Terrace',
  'Storage',
  'Parking',
  'Pet Friendly',
  'Furnished',
  'High Ceilings',
  'Natural Light',
  'Modern Kitchen',
  'Master Suite',
  'Guest Room',
  'Home Office'
];

// File upload settings
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

export default API_BASE_URL;
