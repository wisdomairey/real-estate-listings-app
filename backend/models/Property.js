import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: {
      values: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'studio'],
      message: 'Invalid property type'
    }
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['available', 'sold', 'pending', 'rented'],
      message: 'Invalid property status'
    },
    default: 'available'
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  area: {
    type: Number,
    required: [true, 'Property area is required'],
    min: [1, 'Area must be at least 1 square foot']
  },
  address: {
    type: String,
    required: [true, 'Property address is required'],
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)|(\/uploads\/)/.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  features: [{
    type: String,
    trim: true
  }],
  yearBuilt: {
    type: Number,
    min: [1800, 'Year built cannot be before 1800'],
    max: [new Date().getFullYear() + 5, 'Year built cannot be more than 5 years in the future']
  },
  parkingSpaces: {
    type: Number,
    min: [0, 'Parking spaces cannot be negative'],
    default: 0
  },
  petFriendly: {
    type: Boolean,
    default: false
  },
  furnished: {
    type: Boolean,
    default: false
  },
  utilities: {
    heating: { type: Boolean, default: false },
    cooling: { type: Boolean, default: false },
    electricity: { type: Boolean, default: true },
    water: { type: Boolean, default: true },
    internet: { type: Boolean, default: false }
  },
  contactInfo: {
    agentName: {
      type: String,
      trim: true
    },
    agentPhone: {
      type: String,
      trim: true
    },
    agentEmail: {
      type: String,
      trim: true,
      lowercase: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
propertySchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
propertySchema.index({ type: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ bedrooms: 1, bathrooms: 1 });
propertySchema.index({ createdAt: -1 });

// Virtual for price per square foot
propertySchema.virtual('pricePerSqFt').get(function() {
  return this.area ? Math.round(this.price / this.area) : 0;
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(this.price);
});

// Static method to get properties within a radius
propertySchema.statics.findNearby = function(latitude, longitude, radiusKm = 10) {
  const earthRadius = 6371; // Earth's radius in kilometers
  const radiusRad = radiusKm / earthRadius;

  return this.find({
    'coordinates.latitude': {
      $gte: latitude - (radiusRad * 180 / Math.PI),
      $lte: latitude + (radiusRad * 180 / Math.PI)
    },
    'coordinates.longitude': {
      $gte: longitude - (radiusRad * 180 / Math.PI / Math.cos(latitude * Math.PI / 180)),
      $lte: longitude + (radiusRad * 180 / Math.PI / Math.cos(latitude * Math.PI / 180))
    }
  });
};

// Instance method to check if property is available
propertySchema.methods.isAvailable = function() {
  return this.status === 'available';
};

const Property = mongoose.model('Property', propertySchema);

export default Property;
