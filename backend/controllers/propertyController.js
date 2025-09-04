import { validationResult } from 'express-validator';
import Property from '../models/Property.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import path from 'path';
import fs from 'fs';

// @desc    Get all properties with filtering and pagination
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    search,
    type,
    status = 'available',
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    features,
    latitude,
    longitude,
    radius = 10,
    petFriendly,
    furnished
  } = req.query;

  // Build query
  let query = {};

  // Status filter (default to available for public access)
  if (req.user && req.user.role === 'admin') {
    // Admin can see all statuses
    if (status && status !== 'all') {
      query.status = status;
    }
  } else {
    // Public users only see available properties
    query.status = 'available';
  }

  // Search in title and description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
    ];
  }

  // Property type filter
  if (type) {
    query.type = type;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Bedrooms filter (greater than or equal to)
  if (bedrooms) {
    query.bedrooms = { $gte: parseInt(bedrooms) };
  }

  // Bathrooms filter
  if (bathrooms) {
    query.bathrooms = { $gte: parseFloat(bathrooms) };
  }

  // Area filter
  if (minArea || maxArea) {
    query.area = {};
    if (minArea) query.area.$gte = parseFloat(minArea);
    if (maxArea) query.area.$lte = parseFloat(maxArea);
  }

  // Features filter (property must have all selected features)
  if (features) {
    const featureArray = Array.isArray(features) ? features : [features];
    query.features = { $all: featureArray };
  }

  // Boolean filters
  if (petFriendly !== undefined) {
    query.petFriendly = petFriendly === 'true';
  }
  
  if (furnished !== undefined) {
    query.furnished = furnished === 'true';
  }

  // Location-based search
  if (latitude && longitude) {
    const properties = await Property.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius)
    );
    
    if (properties.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          properties: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0
          },
          filters: req.query
        }
      });
    }
    
    const propertyIds = properties.map(p => p._id);
    query._id = { $in: propertyIds };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .select('-__v');

  // Calculate pagination info
  const pages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: {
      properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages,
        hasNext: pageNum < pages,
        hasPrev: pageNum > 1
      },
      filters: {
        applied: req.query,
        available: {
          types: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'studio'],
          statuses: ['available', 'sold', 'pending', 'rented']
        }
      }
    }
  });
});

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Check if user can view this property
  if (property.status !== 'available' && (!req.user || req.user.role !== 'admin')) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      property
    }
  });
});

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Admin only)
export const createProperty = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Handle uploaded images
  const images = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      images.push(`/uploads/properties/${file.filename}`);
    });
  }

  // Create property data
  const propertyData = {
    ...req.body,
    images
  };

  // Parse coordinates if they're strings
  if (typeof propertyData.coordinates === 'string') {
    propertyData.coordinates = JSON.parse(propertyData.coordinates);
  }

  // Parse features if it's a string
  if (typeof propertyData.features === 'string') {
    try {
      propertyData.features = JSON.parse(propertyData.features);
    } catch (e) {
      propertyData.features = propertyData.features.split(',').map(f => f.trim());
    }
  }

  const property = await Property.create(propertyData);

  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: {
      property
    }
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Admin only)
export const updateProperty = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  let property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Handle new uploaded images
  let updatedImages = [...property.images];
  
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => `/uploads/properties/${file.filename}`);
    
    // If replacing all images
    if (req.body.replaceImages === 'true') {
      // Delete old image files
      property.images.forEach(imagePath => {
        const fullPath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
      updatedImages = newImages;
    } else {
      // Add new images to existing ones
      updatedImages = [...updatedImages, ...newImages];
    }
  }

  // Prepare update data
  const updateData = {
    ...req.body,
    images: updatedImages
  };

  // Parse coordinates if they're strings
  if (typeof updateData.coordinates === 'string') {
    updateData.coordinates = JSON.parse(updateData.coordinates);
  }

  // Parse features if it's a string
  if (typeof updateData.features === 'string') {
    try {
      updateData.features = JSON.parse(updateData.features);
    } catch (e) {
      updateData.features = updateData.features.split(',').map(f => f.trim());
    }
  }

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  property = await Property.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Property updated successfully',
    data: {
      property
    }
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Admin only)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Delete associated image files
  property.images.forEach(imagePath => {
    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (error) {
        console.error(`Failed to delete image file: ${fullPath}`, error);
      }
    }
  });

  await Property.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Property deleted successfully'
  });
});

// @desc    Get property statistics
// @route   GET /api/properties/stats
// @access  Private (Admin only)
export const getPropertyStats = asyncHandler(async (req, res) => {
  const stats = await Property.aggregate([
    {
      $group: {
        _id: null,
        totalProperties: { $sum: 1 },
        availableProperties: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
        },
        soldProperties: {
          $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] }
        },
        pendingProperties: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        rentedProperties: {
          $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] }
        },
        averagePrice: { $avg: '$price' },
        totalValue: { $sum: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);

  const typeStats = await Property.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {
        totalProperties: 0,
        availableProperties: 0,
        soldProperties: 0,
        pendingProperties: 0,
        rentedProperties: 0,
        averagePrice: 0,
        totalValue: 0,
        minPrice: 0,
        maxPrice: 0
      },
      byType: typeStats
    }
  });
});

// @desc    Remove image from property
// @route   DELETE /api/properties/:id/images
// @access  Private (Admin only)
export const removePropertyImage = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Image URL is required'
    });
  }

  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Check if image exists in property
  const imageIndex = property.images.indexOf(imageUrl);
  if (imageIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Image not found in property'
    });
  }

  // Remove image from array
  property.images.splice(imageIndex, 1);
  await property.save();

  // Delete physical file
  const fullPath = path.join(process.cwd(), imageUrl);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (error) {
      console.error(`Failed to delete image file: ${fullPath}`, error);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Image removed successfully',
    data: {
      property
    }
  });
});
