import { body, query, param } from 'express-validator';

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const validateProperty = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('type')
    .isIn(['house', 'apartment', 'condo', 'townhouse', 'villa', 'studio'])
    .withMessage('Invalid property type'),
  body('status')
    .optional()
    .isIn(['available', 'sold', 'pending', 'rented'])
    .withMessage('Invalid property status'),
  body('bedrooms')
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms')
    .isFloat({ min: 0 })
    .withMessage('Bathrooms must be a non-negative number'),
  body('area')
    .isFloat({ min: 1 })
    .withMessage('Area must be at least 1 square foot'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('yearBuilt')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() + 5 })
    .withMessage('Year built must be valid'),
  body('parkingSpaces')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Parking spaces must be non-negative'),
  body('petFriendly')
    .optional()
    .isBoolean()
    .withMessage('Pet friendly must be a boolean'),
  body('furnished')
    .optional()
    .isBoolean()
    .withMessage('Furnished must be a boolean')
];

export const validatePropertyUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('type')
    .optional()
    .isIn(['house', 'apartment', 'condo', 'townhouse', 'villa', 'studio'])
    .withMessage('Invalid property type'),
  body('status')
    .optional()
    .isIn(['available', 'sold', 'pending', 'rented'])
    .withMessage('Invalid property status'),
  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Bathrooms must be a non-negative number'),
  body('area')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Area must be at least 1 square foot'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

export const validatePropertyQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be non-negative'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be non-negative'),
  query('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be non-negative'),
  query('bathrooms')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Bathrooms must be non-negative'),
  query('type')
    .optional()
    .isIn(['house', 'apartment', 'condo', 'townhouse', 'villa', 'studio'])
    .withMessage('Invalid property type'),
  query('status')
    .optional()
    .isIn(['available', 'sold', 'pending', 'rented'])
    .withMessage('Invalid property status'),
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('radius')
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Radius must be between 0.1 and 100 km')
];

export const validatePropertyId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid property ID format')
];
