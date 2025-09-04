import api from './api';

export const propertyService = {
  // Get all properties with filters
  async getProperties(params = {}) {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  // Get single property by ID
  async getProperty(id) {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property (admin only)
  async createProperty(propertyData) {
    const formData = new FormData();
    
    // Append all property data
    Object.keys(propertyData).forEach(key => {
      if (key === 'images') {
        // Handle multiple files
        if (propertyData.images && propertyData.images.length > 0) {
          Array.from(propertyData.images).forEach(file => {
            formData.append('images', file);
          });
        }
      } else if (key === 'coordinates' || key === 'features') {
        // Handle objects and arrays
        formData.append(key, JSON.stringify(propertyData[key]));
      } else {
        formData.append(key, propertyData[key]);
      }
    });

    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update property (admin only)
  async updateProperty(id, propertyData) {
    const formData = new FormData();
    
    // Append all property data
    Object.keys(propertyData).forEach(key => {
      if (key === 'images' && propertyData.images instanceof FileList) {
        // Handle new file uploads
        Array.from(propertyData.images).forEach(file => {
          formData.append('images', file);
        });
      } else if (key === 'coordinates' || key === 'features') {
        // Handle objects and arrays
        formData.append(key, JSON.stringify(propertyData[key]));
      } else if (propertyData[key] !== undefined) {
        formData.append(key, propertyData[key]);
      }
    });

    const response = await api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property (admin only)
  async deleteProperty(id) {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Get property statistics (admin only)
  async getPropertyStats() {
    const response = await api.get('/properties/admin/stats');
    return response.data;
  },

  // Remove image from property (admin only)
  async removePropertyImage(id, imageUrl) {
    const response = await api.delete(`/properties/${id}/images`, {
      data: { imageUrl }
    });
    return response.data;
  },

  // Search properties with filters
  async searchProperties(filters) {
    const queryParams = new URLSearchParams();
    
    // Add all filter parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        if (Array.isArray(filters[key])) {
          filters[key].forEach(value => {
            queryParams.append(key, value);
          });
        } else {
          queryParams.append(key, filters[key]);
        }
      }
    });

    const response = await api.get(`/properties?${queryParams.toString()}`);
    return response.data;
  },

  // Get properties near location
  async getPropertiesNearby(latitude, longitude, radius = 10, additionalFilters = {}) {
    const params = {
      latitude,
      longitude,
      radius,
      ...additionalFilters
    };
    
    const response = await api.get('/properties', { params });
    return response.data;
  },

  // Format price for display
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  // Format area for display
  formatArea(area) {
    return new Intl.NumberFormat('en-US').format(area) + ' sq ft';
  },

  // Get property type label
  getPropertyTypeLabel(type) {
    const types = {
      house: 'House',
      apartment: 'Apartment',
      condo: 'Condo',
      townhouse: 'Townhouse',
      villa: 'Villa',
      studio: 'Studio'
    };
    return types[type] || type;
  },

  // Get property status label and color
  getPropertyStatusInfo(status) {
    const statuses = {
      available: { label: 'Available', color: 'green' },
      pending: { label: 'Pending', color: 'yellow' },
      sold: { label: 'Sold', color: 'red' },
      rented: { label: 'Rented', color: 'blue' }
    };
    return statuses[status] || { label: status, color: 'gray' };
  }
};
