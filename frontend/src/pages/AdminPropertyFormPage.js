import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { propertyService } from '../services/propertyService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminPropertyFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      type: 'sale',
      status: 'available',
      bedrooms: '',
      bathrooms: '',
      area: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: {
        latitude: '',
        longitude: ''
      },
      features: [],
      petFriendly: false,
      furnished: false,
      contactInfo: {
        name: '',
        phone: '',
        email: ''
      }
    }
  });

  const watchedFeatures = watch('features');

  // Available features
  const availableFeatures = [
    'parking', 'garage', 'pool', 'gym', 'garden', 'balcony', 'terrace',
    'fireplace', 'ac', 'heating', 'elevator', 'security', 'storage'
  ];

  useEffect(() => {
    if (isEdit) {
      loadProperty();
    }
  }, [id, isEdit]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getProperty(id);
      
      if (response.success) {
        const property = response.data;
        
        // Set form values
        reset({
          title: property.title || '',
          description: property.description || '',
          price: property.price || '',
          type: property.type || 'sale',
          status: property.status || 'available',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          area: property.area || '',
          address: property.address || '',
          city: property.city || '',
          state: property.state || '',
          zipCode: property.zipCode || '',
          coordinates: {
            latitude: property.coordinates?.latitude || '',
            longitude: property.coordinates?.longitude || ''
          },
          features: property.features || [],
          petFriendly: property.petFriendly || false,
          furnished: property.furnished || false,
          contactInfo: {
            name: property.contactInfo?.name || '',
            phone: property.contactInfo?.phone || '',
            email: property.contactInfo?.email || ''
          }
        });

        // Set existing images
        if (property.images) {
          setExistingImages(property.images);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property');
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Check total image limit
    const totalImages = existingImages.length + selectedImages.length + validFiles.length - imagesToDelete.length;
    if (totalImages > 10) {
      toast.error('Maximum 10 images allowed per property');
      return;
    }

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          file,
          url: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imagePath) => {
    setImagesToDelete(prev => [...prev, imagePath]);
  };

  const restoreExistingImage = (imagePath) => {
    setImagesToDelete(prev => prev.filter(path => path !== imagePath));
  };

  const toggleFeature = (feature) => {
    const currentFeatures = watchedFeatures || [];
    if (currentFeatures.includes(feature)) {
      setValue('features', currentFeatures.filter(f => f !== feature));
    } else {
      setValue('features', [...currentFeatures, feature]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add property data
      Object.keys(data).forEach(key => {
        if (key === 'coordinates') {
          if (data.coordinates.latitude && data.coordinates.longitude) {
            formData.append('coordinates[latitude]', data.coordinates.latitude);
            formData.append('coordinates[longitude]', data.coordinates.longitude);
          }
        } else if (key === 'contactInfo') {
          Object.keys(data.contactInfo).forEach(contactKey => {
            if (data.contactInfo[contactKey]) {
              formData.append(`contactInfo[${contactKey}]`, data.contactInfo[contactKey]);
            }
          });
        } else if (key === 'features') {
          data.features.forEach(feature => {
            formData.append('features', feature);
          });
        } else if (typeof data[key] === 'boolean') {
          formData.append(key, data[key]);
        } else if (data[key]) {
          formData.append(key, data[key]);
        }
      });

      // Add new images
      selectedImages.forEach(file => {
        formData.append('images', file);
      });

      // Add images to delete (for edit mode)
      if (isEdit && imagesToDelete.length > 0) {
        imagesToDelete.forEach(imagePath => {
          formData.append('imagesToDelete', imagePath);
        });
      }

      let response;
      if (isEdit) {
        response = await propertyService.updateProperty(id, formData);
      } else {
        response = await propertyService.createProperty(formData);
      }

      if (response.success) {
        toast.success(`Property ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/admin/properties');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} property`);
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/properties')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Properties
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit ? 'Update property information and details' : 'Fill in the details to create a new property listing'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <HomeIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Property title is required' })}
                  className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="e.g., Beautiful 3BR Home with Garden"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  {...register('type', { required: 'Property type is required' })}
                  className={`input w-full ${errors.type ? 'border-red-500' : ''}`}
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className={`input w-full ${errors.status ? 'border-red-500' : ''}`}
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    className={`input w-full pl-10 ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft) *
                </label>
                <input
                  type="number"
                  {...register('area', { 
                    required: 'Area is required',
                    min: { value: 1, message: 'Area must be positive' }
                  })}
                  className={`input w-full ${errors.area ? 'border-red-500' : ''}`}
                  placeholder="e.g., 1200"
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('bedrooms', { 
                    required: 'Number of bedrooms is required',
                    min: { value: 0, message: 'Bedrooms cannot be negative' }
                  })}
                  className={`input w-full ${errors.bedrooms ? 'border-red-500' : ''}`}
                  placeholder="e.g., 3"
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  {...register('bathrooms', { 
                    required: 'Number of bathrooms is required',
                    min: { value: 0, message: 'Bathrooms cannot be negative' }
                  })}
                  className={`input w-full ${errors.bathrooms ? 'border-red-500' : ''}`}
                  placeholder="e.g., 2.5"
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                  className={`input w-full ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe the property, its features, and what makes it special..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <MapPinIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className={`input w-full ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="e.g., 123 Main Street"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className={`input w-full ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="e.g., New York"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  {...register('state', { required: 'State is required' })}
                  className={`input w-full ${errors.state ? 'border-red-500' : ''}`}
                  placeholder="e.g., NY"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  {...register('zipCode')}
                  className="input w-full"
                  placeholder="e.g., 10001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('coordinates.latitude')}
                  className="input w-full"
                  placeholder="e.g., 40.7128"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('coordinates.longitude')}
                  className="input w-full"
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Features & Amenities</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Features
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableFeatures.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={watchedFeatures?.includes(feature) || false}
                        onChange={() => toggleFeature(feature)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {feature}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('petFriendly')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Pet Friendly</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('furnished')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Furnished</span>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <PhotoIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Property Images</h2>
            </div>

            <div className="space-y-6">
              {/* Existing Images (Edit Mode) */}
              {isEdit && existingImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((imagePath, index) => (
                      <div
                        key={index}
                        className={`relative rounded-lg overflow-hidden ${
                          imagesToDelete.includes(imagePath) ? 'opacity-50' : ''
                        }`}
                      >
                        <img
                          src={getImageUrl(imagePath)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        {imagesToDelete.includes(imagePath) ? (
                          <button
                            type="button"
                            onClick={() => restoreExistingImage(imagePath)}
                            className="absolute top-1 right-1 p-1 bg-green-600 text-white rounded-full hover:bg-green-700"
                            title="Restore image"
                          >
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeExistingImage(imagePath)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                            title="Mark for deletion"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {imagePreviews.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">New Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden">
                        <img
                          src={preview.url}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Max 10 images, 5MB each)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <label className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        Choose files
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500">
                      or drag and drop PNG, JPG, GIF up to 5MB each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  {...register('contactInfo.name', { required: 'Contact name is required' })}
                  className={`input w-full ${errors.contactInfo?.name ? 'border-red-500' : ''}`}
                  placeholder="e.g., John Doe"
                />
                {errors.contactInfo?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactInfo.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('contactInfo.phone', { required: 'Phone number is required' })}
                  className={`input w-full ${errors.contactInfo?.phone ? 'border-red-500' : ''}`}
                  placeholder="e.g., (555) 123-4567"
                />
                {errors.contactInfo?.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactInfo.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('contactInfo.email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`input w-full ${errors.contactInfo?.email ? 'border-red-500' : ''}`}
                  placeholder="e.g., john@example.com"
                />
                {errors.contactInfo?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactInfo.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/properties')}
              className="btn btn-outline"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Update Property' : 'Create Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPropertyFormPage;
